import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import LeagueService from './leagueService'
import { SCHEMA as UserSchema } from '../users/userValidator'

const service = new LeagueService()

const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().max(128),
  defaultTax: Joi.number().allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  // Associations
  user: UserSchema,
})

export const [validator, find] = getValidators(SCHEMA, service)
