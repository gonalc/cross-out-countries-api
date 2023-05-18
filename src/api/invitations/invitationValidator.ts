import express from 'express'
import Joi from 'joi'
import Boom from '@hapi/boom'
import validate from '../../utils/validate'
import UserService from '../users/userService'
import LeagueService from '../leagues/leagueService'

const userService = new UserService()
const leagueService = new LeagueService()

const SCHEMA = Joi.object({
  userId: Joi.number().integer().positive(),
  leagueId: Joi.number().integer().positive(),
  leagueName: Joi.string().max(128).required(),
})

export async function invitationsValidator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const invalidPayload = await validate(req.body, SCHEMA)

    if (invalidPayload) {
      throw Boom.notAcceptable('Payload is wrong.')
    }

    const { userId, leagueId } = req.body

    const user = await userService.exists(userId)
    const league = await leagueService.exists(leagueId)

    if (!user || !league) {
      throw Boom.badRequest('Make sure user and league exist.')
    }

    next()
  } catch (error) {
    next(error)
  }
}
