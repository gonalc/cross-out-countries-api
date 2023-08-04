import express from 'express'
import Joi from 'joi'
import Boom from '@hapi/boom'
import validate from '../../utils/validate'
import UserService from '../users/userService'
import BadgeService from '../badges/badgeService'

const userService = new UserService()
const badgeService = new BadgeService()

const SCHEMA = Joi.object({
  userId: Joi.number().integer().positive(),
  badgeId: Joi.number().integer().positive(),
})

export async function badgeUsersValidator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const invalidPayload = await validate(req.body, SCHEMA)

    if (invalidPayload) {
      throw Boom.notAcceptable('Payload is wrong.')
    }

    const { userId, badgeId } = req.body

    const user = await userService.exists(userId)
    const badge = await badgeService.exists(badgeId)

    if (!user || !badge) {
      throw Boom.badRequest('Make sure user and badge exist.')
    }

    next()
  } catch (error) {
    next(error)
  }
}
