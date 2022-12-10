import { Router } from 'express'
import { validator, find } from './userValidator'
import UserController from './userController'

const router = Router()
const controller = new UserController()

router.get('/paged', controller.fetchPaged)
router.get('/:id', find, controller.fetchSingle)
router.get('/', controller.fetchAll)

router.post('/', validator, controller.create)

router.put('/:id', find, validator, controller.update)

router.delete('/:id', find, controller.destroy)

export default router
