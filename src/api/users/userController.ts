import express from 'express'
import GenericController from '../GenericController'
import UserService from './userService'
import { StatusCodes } from 'http-status-codes'
import { getPopulatedFields } from '../../utils/query'
import type { IFetchOptions } from '../GenericService'

const service = new UserService()

class UserController extends GenericController<UserService> {
  constructor() {
    super(service)
  }

  update = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const include = getPopulatedFields(req)

      const options: IFetchOptions = {
        include,
      }

      if (this.service.fieldsToOmit?.length) {
        options.attributes = {
          exclude: this.service.fieldsToOmit as string[],
        }
      }

      const id = parseInt(req.params.id)

      const data = await this.service.updateUser(id, req.body, options)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default UserController
