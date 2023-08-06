import { Router } from 'express'
import { validator, find } from './badgeValidator'
import BadgeController from './badgeController'

const router = Router()
const controller = new BadgeController()

router.get('/:id', find, controller.fetchSingle)
router.get('/', controller.fetchAll)

router.post('/', validator, controller.create)

router.put('/:id', find, validator, controller.update)

router.delete('/:id', find, controller.destroy)

export default router
