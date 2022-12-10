import Boom from '@hapi/boom'
import express from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

const { NOT_FOUND, METHOD_NOT_ALLOWED, IM_A_TEAPOT } = StatusCodes

const boom = new Boom.Boom()

type BoomError = typeof boom

type TError = {
  status: number
  message: string
}

export function notFoundError(req: express.Request, res: express.Response) {
  res.status(NOT_FOUND).json({
    error: {
      code: NOT_FOUND,
      message: getReasonPhrase(NOT_FOUND),
    },
  })
}

export function methodNotAllowedError(
  req: express.Request,
  res: express.Response
) {
  res.status(METHOD_NOT_ALLOWED).json({
    error: {
      code: METHOD_NOT_ALLOWED,
      message: getReasonPhrase(METHOD_NOT_ALLOWED),
    },
  })
}

export function genericErrorHandler(
  error: BoomError | Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) {
  const isBoom = Boom.isBoom(error)

  let errorData: TError

  if (isBoom) {
    const { statusCode, payload } = error.output

    errorData = {
      status: statusCode,
      message: payload.message,
    }
  } else {
    errorData = {
      status: IM_A_TEAPOT,
      message:
        error.message ?? 'This is the time when you check the error handling.',
    }
  }

  res.status(errorData.status).json(errorData)
}
