import GenericController from '../GenericController'
import VenueService from './leagueService'

const service = new VenueService()

class VenueController extends GenericController<VenueService> {
  constructor() {
    super(service)
  }
}

export default VenueController
