import GenericController from '../GenericController'
import LeagueService from './leagueService'

const service = new LeagueService()

class LeagueController extends GenericController<LeagueService> {
  constructor() {
    super(service)
  }
}

export default LeagueController
