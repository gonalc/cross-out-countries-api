import GenericController from '../GenericController'
import BadgeService from './badgeService'

const service = new BadgeService()

class BadgeController extends GenericController<BadgeService> {
  constructor() {
    super(service)
  }
}

export default BadgeController
