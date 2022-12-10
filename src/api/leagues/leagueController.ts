import express from 'express'
import { StatusCodes } from 'http-status-codes'
import GenericController from '../GenericController'
import LeagueService from './leagueService'

const service = new LeagueService()

class LeagueController extends GenericController<LeagueService> {
  constructor() {
    super(service)
  }

  createLeague = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await this.service.createLeague(req.body)

      return res.status(StatusCodes.CREATED).json({ data })
    } catch (error) {
      next(error)
    }
  }
}

export default LeagueController
