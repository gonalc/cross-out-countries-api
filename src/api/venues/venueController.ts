import GenericController from '../GenericController'
import VenueService from './venueService'

const service = new VenueService()

class VenueController extends GenericController<VenueService> {
  constructor() {
    super(service)
  }
}

export default VenueController
