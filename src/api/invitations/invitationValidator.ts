import express from 'express'
import Joi from 'joi'
import Boom from '@hapi/boom'
import validate, { getValidators } from '../../utils/validate'
import UserService from '../users/userService'
import LeagueService from '../leagues/leagueService'
import InvitationService from './invitationService'

const userService = new UserService()
const leagueService = new LeagueService()

const service = new InvitationService()

const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  userId: Joi.number().integer().positive(),
  user_id: Joi.number().integer().positive(),
  leagueId: Joi.number().integer().positive(),
  leagueName: Joi.string().max(128).required(),
  createdAt: Joi.date(),
})

const CREATE_INVITATION_SCHEMA = Joi.object({
  username: Joi.string().max(128).required(),
  leagueId: Joi.number().integer().positive().required(),
})

export async function inviteWithUsernameValidator(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const invalidPayload = await validate(req.body, CREATE_INVITATION_SCHEMA)

    if (invalidPayload) {
      throw Boom.notAcceptable('Payload is wrong.')
    }

    const { username, leagueId } = req.body

    const league = await leagueService.exists(leagueId)
    const user = await userService.getOneByField({
      where: {
        username,
      },
    })

    if (!user || !league) {
      throw Boom.badRequest('Make sure user and league exist.')
    }

    next()
  } catch (error) {
    next(error)
  }
}

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

export const [validator, find] = getValidators(SCHEMA, service)
