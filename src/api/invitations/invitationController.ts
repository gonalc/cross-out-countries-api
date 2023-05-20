import express from 'express'
import GenericController from '../GenericController'
import InvitationsService from './invitationService'
import { StatusCodes } from 'http-status-codes'

const service = new InvitationsService()

class InvitationController extends GenericController<InvitationsService> {
  constructor() {
    super(service)
  }

  accept = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id)

      const data = await this.service.accept(id, req.body)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default InvitationController
