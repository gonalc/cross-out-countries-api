import express from 'express'
import GenericController from '../GenericController'
import ConquistService from './conquistService'
import { StatusCodes } from 'http-status-codes'

const service = new ConquistService()

class ConquistController extends GenericController<ConquistService> {
  constructor() {
    super(service)
  }

  createConquist = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await this.service.createConquist(req.body)

      return res.status(StatusCodes.CREATED).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default ConquistController
