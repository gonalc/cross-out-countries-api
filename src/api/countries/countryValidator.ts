import Joi from 'joi'
import CountryService from './countryService'
import { getValidators } from '../../utils/validate'

const service = new CountryService()

const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  code: Joi.string().max(3),
  latitude: Joi.number(),
  longitude: Joi.number(),
  population: Joi.number().integer(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export const [validator, find, manyValidator] = getValidators(SCHEMA, service)
