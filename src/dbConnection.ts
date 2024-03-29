import { ConnectionOptions, Dialect } from 'sequelize'
import logger from './utils/logger'

let connection: ConnectionOptions & { port?: number } = {}

const getPort = () => {
  const DEFAULT_PORT = 3306

  const portExists = !!process.env.DB_PORT
  const port = Number(process.env.DB_PORT)

  if (!portExists || isNaN(port)) {
    return DEFAULT_PORT
  }

  return port
}

if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  logger.error('Database fields are needed for the connection')
} else {
  const port = getPort()

  connection = {
    port,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }

  // For the test environment
  if (process.env.NODE_ENV === 'test') {
    connection = {
      ...connection,
      port,
      host: process.env.TEST_DB_HOST,
      username: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    }
  }

  // When running scripts
  if (process.env.NODE_ENV === 'scripts') {
    connection = {
      ...connection,
      port,
      host: process.env.SCRIPTS_DB_HOST,
      username: process.env.SCRIPTS_DB_USER,
      password: process.env.SCRIPTS_DB_PASSWORD,
      database: process.env.SCRIPTS_DB_NAME,
    }
  }
}

export const getDialect = (): Dialect => {
  const DEFAULT_DIALECT: Dialect = 'mysql'

  const dialect = process.env.DB_CLIENT || DEFAULT_DIALECT

  return dialect as Dialect
}

export default connection
