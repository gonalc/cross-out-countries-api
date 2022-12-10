import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import UserService from './userService'

const service = new UserService()

const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().max(128),
  password: Joi.string().max(256),
  venueId: Joi.number().integer(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export const [validator, find] = getValidators(SCHEMA, service)
