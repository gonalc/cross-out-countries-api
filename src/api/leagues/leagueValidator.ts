import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import LeagueService from './leagueService'

const service = new LeagueService()

const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().max(128),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  // Asssociations
  user: Joi.object({
    id: Joi.number().integer(),
  }),
})

export const [validator, find] = getValidators(SCHEMA, service)
