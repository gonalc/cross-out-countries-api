import LeagueModel from './leagueModel'
import GenericService, { IServiceOptions } from '../GenericService'
import { CreationAttributes } from 'sequelize'
import Boom from '@hapi/boom'
import UserService from '../users/userService'
import LeagueUserService from '../leagueUsers/leagueUserService'

type AppCreationLeague = CreationAttributes<LeagueModel> & {
  user: {
    id: number
  }
}

const userService = new UserService()
const leagueUserService = new LeagueUserService()

const options: IServiceOptions<LeagueModel> = {
  searchFields: ['name'],
}

class LeagueService extends GenericService<LeagueModel> {
  constructor() {
    super(LeagueModel, options)
  }

  async createLeague(data: AppCreationLeague) {
    try {
      const { user, ...leagueToCreate } = data

      const foundUser = await userService.getSingle(user.id, {})

      if (!foundUser) {
        throw Boom.notFound('User not found')
      }

      const createdLeague = await this.create(leagueToCreate)

      await leagueUserService.create({
        userId: user.id,
        leagueId: createdLeague.id,
      })

      return { ...createdLeague.toJSON(), players: [foundUser.toJSON()] }
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default LeagueService
