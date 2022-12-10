import express from 'express'
import { StatusCodes } from 'http-status-codes'
import AuthService from './AuthService'

const service = new AuthService()

class AuthController {
  login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await service.login(req.body)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default AuthController
