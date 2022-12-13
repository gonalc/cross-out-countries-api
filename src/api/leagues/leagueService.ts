import LeagueModel from './leagueModel'
import GenericService, { IServiceOptions } from '../GenericService'

const options: IServiceOptions<LeagueModel> = {
  searchFields: ['name'],
}

class LeagueService extends GenericService<LeagueModel> {
  constructor() {
    super(LeagueModel, options)
  }
}

export default LeagueService
