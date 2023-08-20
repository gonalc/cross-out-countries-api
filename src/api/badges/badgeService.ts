import Boom from '@hapi/boom'
import GenericService, { type IServiceOptions } from '../GenericService'
import BadgeModel from './badgeModel'
import UserService from '../users/userService'

type BadgesHash = Map<number, BadgeModel['name']>

const options: IServiceOptions<BadgeModel> = {
  searchFields: ['name'],
}

class BadgeService extends GenericService<BadgeModel> {
  constructor() {
    super(BadgeModel, options)
  }

  private getReferralBadgeHash(): BadgesHash {
    const referralAmountRewards = [1, 5, 10]

    const badgesHash: BadgesHash = new Map()

    referralAmountRewards.forEach((rewardedAmount) => {
      badgesHash.set(rewardedAmount, `share-app-${rewardedAmount}`)
    })

    return badgesHash
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
}

export default BadgeService
