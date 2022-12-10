import VenueModel from './venueModel'
import GenericService, { IServiceOptions } from '../GenericService'

const options: IServiceOptions<VenueModel> = {
  searchFields: ['name'],
}

class VenueService extends GenericService<VenueModel> {
  constructor() {
    super(VenueModel, options)
  }
}

export default VenueService
