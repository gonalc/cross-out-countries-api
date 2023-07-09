import express from 'express'
import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import UserService from './userService'
import { Op } from 'sequelize'
import Boom from '@hapi/boom'

const service = new UserService()

export const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().max(128),
  username: Joi.string().max(128),
  name: Joi.string().max(128),
  birthdate: Joi.date(),
  country: Joi.string().max(128),
  city: Joi.string().max(128).allow(null),
  password: Joi.string().max(256),
  fcmToken: Joi.string().max(255).allow(null),
  score: Joi.number().integer().allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export async function checkIfUserIsUnique(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { email, username } = req.body

  const user = await service.getOneByField({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  })

  if (user) {
    next(Boom.conflict('Email and username must be unique.'))
  } else {
    next()
  }
}

export const [validator, find] = getValidators(SCHEMA, service)
