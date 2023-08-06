import { Router } from 'express'
import authRoutes from './api/auth/AuthRoutes'
import userRoutes from './api/users/userRoutes'
import leagueRoutes from './api/leagues/leagueRoutes'
import leagueUserRoutes from './api/leagueUsers/leagueUserRoutes'
import badgeUserRoutes from './api/badgeUsers/badgeUserRoutes'
import conquistRoutes from './api/conquists/conquistRoutes'
import invitationsRoutes from './api/invitations/invitationRoutes'
import countryRoutes from './api/countries/countryRoutes'
import badgeRoutes from './api/badges/badgeRoutes'

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
router.use('/badges', badgeRoutes)
router.use('/leagues', leagueRoutes)
router.use('/countries', countryRoutes)
router.use('/players', leagueUserRoutes)
router.use('/conquists', conquistRoutes)
router.use('/badge-users', badgeUserRoutes)
router.use('/invitations', invitationsRoutes)

export default router
