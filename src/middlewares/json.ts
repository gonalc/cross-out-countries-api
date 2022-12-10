import Boom from '@hapi/boom'
import express from 'express'
import _isEmpty from 'lodash/isEmpty'

function json(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { body, method } = req
  const disallowesHttpHeaders = ['PUT', 'POST', 'PATCH']

  if (
    req.is('application/json') &&
    disallowesHttpHeaders.includes(method) &&
    _isEmpty(body)
  ) {
    throw Boom.badRequest('Empty JSON')
  }

  next()
}

export default json
