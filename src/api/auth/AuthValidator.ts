import express from 'express'
import Boom from '@hapi/boom'
import Joi from 'joi'
import validate from '../../utils/validate'
import UserService from '../users/userService'
import { Op } from 'sequelize'

const userService = new UserService()

const SCHEMA = Joi.object({
  userKey: Joi.string().max(128),
  password: Joi.string().max(128),
})

export async function loginValidator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const invalidPayload = await validate(req.body, SCHEMA)

    if (invalidPayload) {
      throw Boom.notAcceptable('Payload is wrong.')
    }

    const { userKey } = req.body

    const user = await userService.getOneByField({
      where: {
        [Op.or]: [{ email: userKey }, { username: userKey }],
      },
    })

    if (!user) {
      throw Boom.notFound('User not found.')
    }

    if (user) {
      req.body.user = user.toJSON()
      next()
    }
  } catch (error) {
    next(error)
  }
}
