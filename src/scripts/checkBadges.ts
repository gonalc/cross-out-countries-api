import BadgeService from '../api/badges/badgeService'
import UserService from '../api/users/userService'
import logger from '../utils/logger'

async function grantBadges() {
  if (process.env.NODE_ENV !== 'test') {
    const userService = new UserService()
    const badgeService = new BadgeService()

    const users = await userService.getAll({
      attributes: ['id'],
    })

    for (const userData of users) {
      await badgeService.checkConquistBadges(userData.id)
    }

    logger.info('Badges checked successfully')
  }
}

grantBadges()
