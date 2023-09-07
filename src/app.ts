import './env'
import './db'

import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import logger, { logStream } from './utils/logger'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import json from './middlewares/json'
import routes from './routes'
import {
  genericErrorHandler,
  methodNotAllowedError,
} from './middlewares/errorHandling'
import auth from './middlewares/auth'
import './scripts/recalculateScores'

const app = express()

const PORT = process.env.PORT || 3000

app.set('port', PORT)

app.locals.title = process.env.APP_NAME
app.locals.version = process.env.APP_VERSION

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('tiny', { stream: logStream }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(json)
app.use(auth)

app.use('/api', routes)

app.use(genericErrorHandler)
app.use(methodNotAllowedError)

process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled rejection: ${String(error)}`)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${String(error)}`)
  process.exit(1)
})

export default app
