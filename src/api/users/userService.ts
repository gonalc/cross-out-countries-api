import UserModel from './userModel'
import GenericService, {
  type IFetchOptions,
  type IServiceOptions,
} from '../GenericService'
import Boom from '@hapi/boom'
import type { UserAttributes } from './userTypes'
import { hashPassword } from '../../utils/crypto'

export const userFieldsToOmit = ['salt', 'password'] as const

const options: IServiceOptions<UserModel> = {
  searchFields: ['email'],
  fieldsToOmit: ['salt', 'password'],
}

class UserService extends GenericService<UserModel> {
  constructor() {
    super(UserModel, options)
  }

  async updateUser(
    id: UserAttributes['id'],
    data: Partial<UserAttributes>,
    findOptions: IFetchOptions
  ) {
    try {
      let dataToUpdate: Partial<UserAttributes> = { ...data }

      if (dataToUpdate.password) {
        // Check if password is new
        // Update if needed
        const user = await this.getSingle(id, {
          attributes: ['salt', 'password'],
        })

        if (!user) {
          return null
        }

        const newHashedPassword = hashPassword(
          dataToUpdate.password,
          user.get('salt')
        )

        const passwordHasChanged = newHashedPassword !== user.get('password')

        if (passwordHasChanged) {
          dataToUpdate = {
            ...dataToUpdate,
            password: newHashedPassword,
          }
        } else {
          delete dataToUpdate.password
        }
      }

      const updatedUser = await this.update(id, dataToUpdate, findOptions)

      return updatedUser
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async increaseScore(score: number, userId: number) {
    try {
      await this.Model.increment({ score }, { where: { id: userId } })
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default UserService
