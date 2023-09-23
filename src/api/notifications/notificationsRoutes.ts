import { Router } from 'express'
import NotificationsController from './notificationsController'

const router = Router()
const controller = new NotificationsController()

router.post('/', controller.send)

export default router
