import { Router } from 'express'
import AuthController from './AuthController'
import { loginValidator } from './AuthValidator'

const controller = new AuthController()

const router = Router()

router.post('/login', loginValidator, controller.login)

export default router
