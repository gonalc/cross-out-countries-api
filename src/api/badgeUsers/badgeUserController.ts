import GenericController from '../GenericController'
import BadgeUserService from './badgeUserService'

const service = new BadgeUserService()

class BadgeUserController extends GenericController<BadgeUserService> {
  constructor() {
    super(service)
  }
}

export default BadgeUserController
