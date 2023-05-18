import { Router } from 'express'
import InvitationController from './invitationController'
import { invitationsValidator } from './invitationValidator'

const router = Router()
const controller = new InvitationController()

router.get('/', controller.fetchAll)

router.post('/', invitationsValidator, controller.create)

export default router
