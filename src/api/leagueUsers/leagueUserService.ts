import GenericService, { IServiceOptions } from '../GenericService'
import LeagueUserModel from './leagueUsersModel'

const options: IServiceOptions<LeagueUserModel> = {
  searchFields: [],
}

class LeagueUserService extends GenericService<LeagueUserModel> {
  constructor() {
    super(LeagueUserModel, options)
  }
}

export default LeagueUserService
