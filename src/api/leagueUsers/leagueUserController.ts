import GenericController from '../GenericController'
import LeagueUserService from './leagueUserService'

const service = new LeagueUserService()

class LeagueUserController extends GenericController<LeagueUserService> {
  constructor() {
    super(service)
  }
}

export default LeagueUserController
