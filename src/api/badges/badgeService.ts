import Boom from '@hapi/boom'
import GenericService, { type IServiceOptions } from '../GenericService'
import BadgeModel from './badgeModel'
import UserService from '../users/userService'

const options: IServiceOptions<BadgeModel> = {
  searchFields: ['name'],
}

class BadgeService extends GenericService<BadgeModel> {
  constructor() {
    super(BadgeModel, options)
  }

  private referralBadgeHash: Map<number, BadgeModel['name']> = new Map([
    [1, 'share-app-1'],
    [5, 'share-app-5'],
    [10, 'share-app-10'],
  ])

  async checkReferralBadge(userId: number) {
    try {
      const user = await new UserService().getSingle(userId, {
        attributes: ['referredUsers'],
      })

      if (user) {
        const { referredUsers } = user

        const earnedBadge = this.referralBadgeHash.get(referredUsers)

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
