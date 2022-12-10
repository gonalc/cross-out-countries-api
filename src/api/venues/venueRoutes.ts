import { Router } from 'express'
import VenueController from './venueController'
import { validator, find } from './venueValidator'

const router = Router()
const controller = new VenueController()

router.get('/paged', controller.fetchPaged)
router.get('/:id', find, controller.fetchSingle)
router.get('/', controller.fetchAll)

router.post('/', validator, controller.create)

router.put('/:id', find, validator, controller.update)

router.delete('/:id', find, controller.destroy)

export default router
