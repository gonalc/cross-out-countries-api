import { Router } from 'express'
import authRoutes from './api/auth/AuthRoutes'
import userRoutes from './api/users/userRoutes'
import leagueRoutes from './api/leagues/leagueRoutes'

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

export default router
