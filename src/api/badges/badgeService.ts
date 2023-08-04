import GenericService, { type IServiceOptions } from '../GenericService'
import BadgeModel from './badgeModel'

const options: IServiceOptions<BadgeModel> = {
  searchFields: ['name'],
}

class BadgeService extends GenericService<BadgeModel> {
  constructor() {
    super(BadgeModel, options)
  }
}

export default BadgeService
