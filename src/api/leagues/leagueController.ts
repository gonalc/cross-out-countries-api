import express from 'express'
import GenericController from '../GenericController'
import LeagueService from './leagueService'
import { StatusCodes } from 'http-status-codes'

const service = new LeagueService()

class LeagueController extends GenericController<LeagueService> {
  constructor() {
    super(service)
  }

  create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await this.service.createLeague(req.body)

      return res.status(StatusCodes.CREATED).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  getByUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = parseInt(req.params.userId)

      const data = await this.service.getLeaguesByUser(userId)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default LeagueController
