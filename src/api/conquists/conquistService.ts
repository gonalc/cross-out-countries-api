import { CreationAttributes } from 'sequelize'
import GenericService, { IServiceOptions } from '../GenericService'
import ConquistModel from './conquistModel'
import Boom from '@hapi/boom'

type AppConquistToCreate = Omit<CreationAttributes<ConquistModel>, 'score'>

const options: IServiceOptions<ConquistModel> = {
  searchFields: ['country', 'place', 'province'],
}

class ConquistService extends GenericService<ConquistModel> {
  constructor() {
    super(ConquistModel, options)
  }

  async createConquist(data: AppConquistToCreate) {
    try {
      const conquistToCreate: CreationAttributes<ConquistModel> = {
        ...data,
        score: 3,
      }

      const created = await this.create(conquistToCreate)

      return created
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default ConquistService
