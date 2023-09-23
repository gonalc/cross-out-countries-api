import express from 'express'
import NotificationsService from './notificationsService'
import { StatusCodes } from 'http-status-codes'
import type { UserAttributes } from '../users/userTypes'

type NotifiationReqBody = {
  recipientIds?: UserAttributes['id'][]
  title: string
  text?: string
}

class NotificationsController {
  private service: NotificationsService

  constructor() {
    this.service = new NotificationsService()
  }

  send = async (
    req: express.Request<unknown, unknown, NotifiationReqBody>,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { recipientIds, ...message } = req.body

      const data = await this.service.send(message, recipientIds)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default NotificationsController
