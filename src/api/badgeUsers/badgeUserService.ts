import GenericService, { IServiceOptions } from '../GenericService'
import BadgeUserModel from './badgeUserModel'

const options: IServiceOptions<BadgeUserModel> = {
  searchFields: [],
}

class BadgeUserService extends GenericService<BadgeUserModel> {
  constructor() {
    super(BadgeUserModel, options)
  }
}

export default BadgeUserService
