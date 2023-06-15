import { Router } from 'express'
import CountryController from './countryController'
import { validator, find, manyValidator } from './countryValidator'

const router = Router()
const controller = new CountryController()

router.get('/data', controller.getCountriesData)
router.get('/', controller.fetchAll)

router.post('/many', manyValidator, controller.createMany)
router.post('/', validator, controller.create)

router.put('/:id', validator, controller.update)

router.delete('/:id', find, controller.destroy)

export default router
