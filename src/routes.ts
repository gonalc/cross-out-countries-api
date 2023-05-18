import { Router } from 'express'
import authRoutes from './api/auth/AuthRoutes'
import userRoutes from './api/users/userRoutes'
import leagueRoutes from './api/leagues/leagueRoutes'
import leagueUserRoutes from './api/leagueUsers/leagueUserRoutes'
import conquistRoutes from './api/conquists/conquistRoutes'
import invitationsRoutes from './api/invitations/invitationRoutes'

const router = Router()

router.get('/', (req, res) => {
  const data = {
    app: req.app.locals.title,
    apiVersion: req.app.locals.version,
  }

  res.json(data)
})

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/leagues', leagueRoutes)
router.use('/players', leagueUserRoutes)
router.use('/conquists', conquistRoutes)
router.use('/invitations', invitationsRoutes)

export default router
