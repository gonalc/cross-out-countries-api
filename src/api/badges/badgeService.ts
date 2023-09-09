import Boom from '@hapi/boom'
import GenericService, { type IServiceOptions } from '../GenericService'
import BadgeModel from './badgeModel'
import UserService from '../users/userService'
import logger from '../../utils/logger'
import UserModel from '../users/userModel'

type BadgesHash = Map<number, BadgeModel['name']>

const options: IServiceOptions<BadgeModel> = {
  searchFields: ['name'],
}

class BadgeService extends GenericService<BadgeModel> {
  constructor() {
    super(BadgeModel, options)
  }

  private getBadgeHash(amountRewards: number[], baseName: string): BadgesHash {
    const badgesHash: BadgesHash = new Map()

    amountRewards.forEach((rewardedAmount) => {
      badgesHash.set(rewardedAmount, `${baseName}-${rewardedAmount}`)
    })

    return badgesHash
  }

  private getReferralBadgeHash(): BadgesHash {
    const referralAmountRewards = [1, 5, 10]

    const referralBadgesHash = this.getBadgeHash(
      referralAmountRewards,
      'share-app'
    )

    return referralBadgesHash
  }

  async checkReferralBadge(userId: number) {
    try {
      const user = await new UserService().getSingle(userId, {
        attributes: ['referredUsers'],
      })

      if (user) {
        const { referredUsers } = user

        const badgesHash = this.getReferralBadgeHash()

        const earnedBadge = badgesHash.get(referredUsers)

        if (earnedBadge) {
          const badge = await this.getOneByField({
            where: { name: earnedBadge },
            attributes: ['id'],
          })

          if (badge) {
            await new UserService().addBadge(userId, badge.id)
          }
        }
      }
    } catch (error) {
      throw Boom.badRequest(
        `Something went wrong cheching badges: ${JSON.stringify(error)}`
      )
    }
  }

  private getDeservedBadges(user: UserModel): BadgeModel['name'][] {
    const badgesToCheck = [
      { badgeKey: 'country', userKey: 'countries' },
      { badgeKey: 'conquist', userKey: 'conquists' },
      { badgeKey: 'place', userKey: 'places' },
    ] as const

    const amountToReward = [1, 5, 10, 20, 50, 100]

    const hashesData = badgesToCheck.map((data) => {
      return {
        hash: this.getBadgeHash(amountToReward, data.badgeKey),
        keys: data,
      }
    })

    const deservedBadges: BadgeModel['name'][] = []

    hashesData.forEach((hashData) => {
      const { hash, keys } = hashData

      Array.from(hash.keys()).forEach((key) => {
        const items = user[keys.userKey]?.length

        if (items && key <= items) {
          const badgeName = hash.get(key)

          if (badgeName) {
            deservedBadges.push(badgeName)
          }
        }
      })
    })

    return deservedBadges
  }

  async checkConquistBadges(userId: number) {
    const user = await new UserService().getSingle(userId, {
      attributes: ['id'],
      include: ['badges', 'conquists'],
    })

    if (!user) {
      logger.error(`There is no user with id: ${userId}`)
      return
    }

    const deservedBadges = this.getDeservedBadges(user)

    const userBadges = user.badges?.length
      ? user.badges.map((badge) => badge.name)
      : []

    for (const badgeName of deservedBadges) {
      const alreadyGranted = userBadges.includes(badgeName)

      if (!alreadyGranted) {
        const badge = await this.getOneByField({ where: { name: badgeName } })

        if (badge) {
          await user.addBadge(badge, { through: { userId, badgeId: badge.id } })
        }
      }
    }
  }
}

export default BadgeService
