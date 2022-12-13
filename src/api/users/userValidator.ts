import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import UserService from './userService'

const service = new UserService()

export const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string().max(128),
  name: Joi.string().max(128),
  birthdate: Joi.date(),
  country: Joi.string().max(128),
  city: Joi.string().max(128).allow(null),
  password: Joi.string().max(256),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export const [validator, find] = getValidators(SCHEMA, service)
