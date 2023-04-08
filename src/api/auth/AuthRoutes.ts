import { Router } from 'express'
import AuthController from './AuthController'
import { loginValidator } from './AuthValidator'
import { validator as signupValidator } from '../users/userValidator'

const controller = new AuthController()

const router = Router()

router.post('/login', loginValidator, controller.login)
router.post('/signup', signupValidator, controller.signup)
router.post('/check', controller.check)

export default router
