import { Router } from 'express'
import InvitationController from './invitationController'
import {
  invitationsValidator,
  find,
  inviteWithUsernameValidator,
} from './invitationValidator'

const router = Router()
const controller = new InvitationController()

router.get('/', controller.fetchAll)

router.post('/accept/:id', invitationsValidator, controller.accept)
router.post('/invite', inviteWithUsernameValidator, controller.invite)
router.post('/', invitationsValidator, controller.create)

router.delete('/:id', find, controller.destroy)

export default router
