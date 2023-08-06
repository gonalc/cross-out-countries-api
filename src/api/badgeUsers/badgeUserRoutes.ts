import { Router } from 'express'
import BadgeUserController from './badgeUserController'
import { badgeUsersValidator } from './badgeUserValidator'

const router = Router()
const controller = new BadgeUserController()

router.post('/', badgeUsersValidator, controller.create)

export default router
