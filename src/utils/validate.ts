import express from 'express'
import Boom from '@hapi/boom'
import Joi from 'joi'
import GenericService from '../api/GenericService'

export async function validate(data: unknown, schema: Joi.ObjectSchema) {
  try {
    await schema.validateAsync(data, { abortEarly: false })

    return null
  } catch (error) {
    throw Boom.notAcceptable(String(error))
  }
}

export const getValidators = (
  Schema: Joi.ObjectSchema,
  service: InstanceType<typeof GenericService>
) => {
  const validator = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await validate(req.body, Schema)
      next()
    } catch (error) {
      next(error)
    }
  }

  const find = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { name } = service.Model
    try {
      const id = parseInt(req.params.id)

      if (Number.isNaN(id)) {
        throw Boom.badRequest('ID should be a number')
      }

      const result = await service.exists(id)

      if (!result) {
        throw Boom.notFound(`${name} found`)
      }

      next()
    } catch (error) {
      next(Boom.notFound(`${name} not found`))
    }
  }

  return [validator, find]
}

export default validate
