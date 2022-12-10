import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import VenueService from './leagueService'

const service = new VenueService()

const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().max(128),
  defaultTax: Joi.number().allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export const [validator, find] = getValidators(SCHEMA, service)
