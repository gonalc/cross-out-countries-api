import { ConnectionOptions, Dialect } from 'sequelize'
import logger from './utils/logger'

let connection: ConnectionOptions = {}

if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  logger.error('Database fields are needed for the connection')
} else {
  connection = {
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }

  // For the test environment
  if (process.env.NODE_ENV === 'test') {
    connection = {
      ...connection,
      port: Number(process.env.TEST_DB_PORT),
      host: process.env.TEST_DB_HOST,
      username: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    }
  }
}

export const getDialect = (): Dialect => {
  const DEFAULT_DIALECT: Dialect = 'mysql'

  const dialect: Dialect = process.env.DB_CLIENT || DEFAULT_DIALECT

  return dialect
}

export default connection
