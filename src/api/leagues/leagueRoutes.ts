import { Router } from 'express'
import LeagueController from './leagueController'
import { validator, find } from './leagueValidator'

const router = Router()
const controller = new LeagueController()

router.get('/paged', controller.fetchPaged)
router.get('/:id', find, controller.fetchSingle)
router.get('/', controller.fetchAll)

router.post('/', validator, controller.create)

router.put('/:id', find, validator, controller.update)

router.delete('/:id', find, controller.destroy)

export default router
