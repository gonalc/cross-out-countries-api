import express from 'express'
import logger from '../utils/logger'
import AuthService from '../api/auth/AuthService'
import Boom from '@hapi/boom'
import { Request } from '../types/endpoints'

const authService = new AuthService()

const FREE_ENDPOINTS = ['/api/auth/login', '/api/auth/signup'] as const

function endpointIsExent(path: string) {
  return FREE_ENDPOINTS.some((endpoint) => path.startsWith(endpoint))
}

async function authMiddleware(
  req: Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (process.env.NODE_ENV === 'test') {
      return next()
    }

    const token = req.headers.authorization

    const isExent = endpointIsExent(req.path)

    if (isExent) {
      return next()
    }

    if (!token) {
      throw Boom.unauthorized('Session not valid. Please, login.')
    }
    const { user } = await authService.check(token)

    req.user = user

    return next()
  } catch (error) {
    logger.error(`Error logging in: ${String(error)}`)

    next(error)
  }
}

export default authMiddleware
