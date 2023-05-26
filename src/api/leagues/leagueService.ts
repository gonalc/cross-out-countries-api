import LeagueModel from './leagueModel'
import GenericService, { IServiceOptions } from '../GenericService'
import { CreationAttributes } from 'sequelize'
import Boom from '@hapi/boom'
import UserService from '../users/userService'
import LeagueUserService from '../leagueUsers/leagueUserService'
import UserModel from '../users/userModel'

type AppCreationLeague = CreationAttributes<LeagueModel> & {
  user: {
    id: number
  }
}

const userService = new UserService()
const leagueUserService = new LeagueUserService()

const options: IServiceOptions<LeagueModel> = {
  searchFields: ['name'],
}

class LeagueService extends GenericService<LeagueModel> {
  constructor() {
    super(LeagueModel, options)
  }

  async createLeague(data: AppCreationLeague) {
    try {
      const { user, ...leagueToCreate } = data

      const foundUser = await userService.getSingle(user.id, {})

      if (!foundUser) {
        throw Boom.notFound('User not found')
      }

      const createdLeague = await this.create(leagueToCreate)

      await leagueUserService.create({
        userId: user.id,
        leagueId: createdLeague.id,
      })

      return { ...createdLeague.toJSON(), players: [foundUser.toJSON()] }
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async getLeaguesByUser(userId: number) {
    try {
      const leagues = await this.getAll({
        include: [
          {
            model: UserModel,
            attributes: ['id', 'name', 'country', 'city'],
            through: {
              attributes: [],
            },
            as: 'players',
          },
        ],
      })

      return leagues.filter((league) => {
        const { players } = league

        if (!players?.length) return false

        const playerIndex = players.findIndex((player) => player.id === userId)

        return playerIndex >= 0
      })
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default LeagueService
