import { Router } from 'express'
import InvitationController from './invitationController'
import { invitationsValidator } from './invitationValidator'

const router = Router()
const controller = new InvitationController()

router.post('/', invitationsValidator, controller.create)

export default router
