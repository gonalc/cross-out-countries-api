import { Router } from 'express'
import LeagueUserController from './leagueUserController'
import { leagueUsersValidator } from './leagueUsersValidator'

const router = Router()
const controller = new LeagueUserController()

router.post('/', leagueUsersValidator, controller.create)

export default router
