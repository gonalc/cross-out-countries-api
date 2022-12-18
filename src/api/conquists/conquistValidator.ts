import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import ConquistService from './conquistService'

const service = new ConquistService()

export const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  birthYear: Joi.number().integer(),
  country: Joi.string().max(128),
  province: Joi.string().max(128).allow(null),
  place: Joi.string().max(128),
  userId: Joi.number().integer().positive(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export const [validator, find] = getValidators(SCHEMA, service)
