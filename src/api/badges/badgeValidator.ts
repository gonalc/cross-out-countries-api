import Joi from 'joi'
import { getValidators } from '../../utils/validate'
import BadgeService from './badgeService'

const service = new BadgeService()

export const SCHEMA = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().max(128),
  iconKey: Joi.string().max(128),
  iconFamily: Joi.string().max(128),
  color: Joi.string().max(128).allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
})

export const [validator, find] = getValidators(SCHEMA, service)
