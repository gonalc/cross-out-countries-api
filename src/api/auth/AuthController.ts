import express from 'express'
import { StatusCodes } from 'http-status-codes'
import AuthService from './AuthService'
import LogControl from '../../utils/logControl'

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

  signup = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { referral } = req.query

      // Save logs for debugging purpose
      const logText = `Referral query received in the API:
      
      req.query:
      ${JSON.stringify(req.query, null, 2)}
      
      referral:
      ${referral}`

      LogControl.createLog(logText, 'referral-query.txt', 'referral')

      const data = await service.signup(
        req.body,
        referral as string | undefined
      )

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  check = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await service.check(req.body.jwt)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default AuthController
