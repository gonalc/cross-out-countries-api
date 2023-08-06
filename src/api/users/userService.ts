import UserModel from './userModel'
import GenericService, {
  type IFetchOptions,
  type IServiceOptions,
} from '../GenericService'
import Boom from '@hapi/boom'
import type { UserAttributes } from './userTypes'
import { hashPassword } from '../../utils/crypto'
import BadgeModel from '../badges/badgeModel'
import BadgeService from '../badges/badgeService'

const badgeService = new BadgeService()

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

  async addBadge(userId: UserModel['id'], badgeId: BadgeModel['id']) {
    try {
      const user = await this.getSingle(userId, {})

      if (!user) {
        throw Boom.notFound('There is no user found')
      }

      const badge = await badgeService.getSingle(badgeId, {})

      if (!badge) {
        throw Boom.notFound('There is no badge found')
      }

      const res = await user.addBadge(badge, { through: { userId, badgeId } })

      return res
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default UserService
