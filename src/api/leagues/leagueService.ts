import LeagueModel from './leagueModel'
import GenericService, { IServiceOptions } from '../GenericService'
import {
  CreateOptions,
  CreationAttributes,
  Includeable,
  Attributes,
} from 'sequelize'
import Boom from '@hapi/boom'

const options: IServiceOptions<LeagueModel> = {
  searchFields: ['name'],
}

class LeagueService extends GenericService<LeagueModel> {
  constructor() {
    super(LeagueModel, options)
  }

  async createLeague(data: CreationAttributes<LeagueModel>) {
    try {
      const include: Includeable[] = [
        {
          association: LeagueModel.associations.user,
          as: 'user',
        },
      ]

      const createOptions: CreateOptions<Attributes<LeagueModel>> = {
        include,
      }

      return this.create(data, createOptions)
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default LeagueService
