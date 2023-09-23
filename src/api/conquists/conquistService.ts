import { CreationAttributes, Op } from 'sequelize'
import GenericService, { type IServiceOptions } from '../GenericService'
import ConquistModel from './conquistModel'
import Boom from '@hapi/boom'
import UserService from '../users/userService'
import { calculateDistance } from '../../utils/geocoding'
import CountryService from '../countries/countryService'
import LeagueService from '../leagues/leagueService'
import LeagueModel from '../leagues/leagueModel'
import {
  BuildMessagePayload,
  NotificationType,
  sendMessages,
} from '../../utils/notifications'
import BadgeService from '../badges/badgeService'
import { ConquistAttributes } from './conquistTypes'

type AppConquistToCreate = Omit<CreationAttributes<ConquistModel>, 'score'>

const userService = new UserService()
const countryService = new CountryService()
const leagueService = new LeagueService()
const badgeService = new BadgeService()

const MIN_SCORE = 2
const MAX_DISTANCE = 20_000

const options: IServiceOptions<ConquistModel> = {
  searchFields: ['country', 'place', 'province'],
}

class ConquistService extends GenericService<ConquistModel> {
  constructor() {
    super(ConquistModel, options)
  }

  async createConquist(data: AppConquistToCreate) {
    try {
      const score = await this.scoreCalculator(data)

      const conquistToCreate: CreationAttributes<ConquistModel> = {
        ...data,
        score,
      }

      const created = await this.create(conquistToCreate)

      await userService.increaseScore(score, data.userId)

      await badgeService.checkConquistBadges(data.userId)

      // Send notifications to everyone who share League with the conquerer
      await this.sendNotifications(data.userId, data.country)

      return created
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async deleteConquist(id: ConquistAttributes['id']) {
    const conquistToDelete = await this.getSingle(id, {
      attributes: ['id', 'score', 'userId'],
    })

    if (!conquistToDelete) {
      throw Boom.notFound('Conquist not found')
    }

    const { userId, score } = conquistToDelete

    const user = await userService.getSingle(userId, {
      attributes: ['id', 'score'],
    })

    if (!user) {
      throw Boom.notFound('User to decrement score not found')
    }

    await user.decrement('score', { by: score })

    const deletedConquist = await this.destroy(id)

    return deletedConquist
  }

  private async sendNotifications(userId: number, country: string) {
    try {
      const recipients = await this.getNotificationRecipients(userId)

      const conquererUser = await userService.getSingle(userId, {
        attributes: ['name'],
      })

      const baseMessage: Omit<BuildMessagePayload, 'token'> = {
        title: '¡Nueva conquista!',
        text: `${conquererUser?.get('name')} ha conquistado ${country}`,
        type: NotificationType.CONQUIST,
      }

      const messages: BuildMessagePayload[] = recipients.map((token) => {
        const message: BuildMessagePayload = {
          ...baseMessage,
          token,
        }

        return message
      })

      await sendMessages(messages)
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  private async getNotificationRecipients(userId: number) {
    try {
      const userLeagues = await leagueService.getLeaguesByUser(userId)
      const leaguesIds = userLeagues.map((league) => league.id)

      const recipients = await userService.getAll({
        include: [
          {
            model: LeagueModel,
            through: { attributes: [] },
            as: 'leagues',
            where: {
              id: {
                [Op.in]: leaguesIds,
              },
            },
          },
        ],
        attributes: ['fcmToken'],
      })

      return recipients
        .map((recipient) => recipient.get('fcmToken'))
        .filter(Boolean)
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async scoreCalculator(data: AppConquistToCreate): Promise<number> {
    const { userId, country, place } = data

    const user = await userService.getSingle(userId, {})

    if (!user) {
      throw Boom.notFound('User not found when calculating score.')
    }

    const conquistCountryData = await countryService.getOneByField({
      where: {
        code: country,
      },
    })

    const conquistPlaceData = await countryService.getOneByField({
      where: {
        code: place,
      },
    })

    const userCountryData = await countryService.getOneByField({
      where: {
        code: user.country,
      },
    })

    if (!userCountryData || !conquistCountryData || !conquistPlaceData) {
      throw Boom.badData('There must be something wrong.')
    }

    const conquistCountry = conquistCountryData.toJSON()
    const conquistPlace = conquistPlaceData.toJSON()
    const userCountry = userCountryData.toJSON()

    const countryDistance = calculateDistance(
      {
        latitude: conquistCountry.latitude,
        longitude: conquistCountry.longitude,
      },
      {
        latitude: userCountry.latitude,
        longitude: userCountry.longitude,
      }
    )
    const placeDistance = calculateDistance(
      {
        latitude: conquistPlace.latitude,
        longitude: conquistPlace.longitude,
      },
      {
        latitude: userCountry.latitude,
        longitude: userCountry.longitude,
      }
    )

    const countryScore = this.getDistanceScore(countryDistance)
    const placeScore = this.getDistanceScore(placeDistance)
    const populationScore = this.getPopulationScore(conquistCountry.population)

    const scores = [countryScore, placeScore, populationScore]

    const finalScore = this.getFinalScore(scores)

    return finalScore
  }

  private getDistanceScore(distance: number): number {
    if (isNaN(distance)) {
      return MIN_SCORE
    }

    if (distance) {
      const ratio = (distance / MAX_DISTANCE) * 100

      if (ratio > MIN_SCORE) {
        return ratio
      }
    }

    return MIN_SCORE
  }

  private getPopulationScore(population: number): number {
    if (!population || isNaN(population)) {
      return MIN_SCORE
    }

    return (1 / population) * 100
  }

  private getFinalScore(scores: number[]): number {
    const total = scores.reduce((a, b) => a + b)

    return Math.floor(total)
  }
}

export default ConquistService
