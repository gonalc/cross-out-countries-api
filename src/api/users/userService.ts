import UserModel from './userModel'
import GenericService, { IServiceOptions } from '../GenericService'
import { Attributes } from 'sequelize'
import Boom from '@hapi/boom'

const options: IServiceOptions<UserModel> = {
  searchFields: ['email'],
}

class UserService extends GenericService<UserModel> {
  constructor() {
    super(UserModel, options)
  }

  async getByEmail(email: Attributes<UserModel>['email']) {
    try {
      const user = await this.Model.findOne({
        where: {
          email,
        },
      })

      return user
    } catch (error) {
      throw Boom.notFound(String(error))
    }
  }
}

export default UserService
