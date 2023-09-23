import { Router } from 'express'
import { validator, find } from './conquistValidator'
import ConquistController from './conquistController'

const router = Router()
const controller = new ConquistController()

router.get('/paged', controller.fetchPaged)
router.get('/:id', find, controller.fetchSingle)
router.get('/', controller.fetchAll)

router.post('/', validator, controller.createConquist)

router.put('/:id', find, validator, controller.update)

router.delete('/:id', find, controller.deleteConquist)

export default router
