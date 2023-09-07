import { Sequelize } from 'sequelize'
import connection, { getDialect } from './dbConnection'
import logger from './utils/logger'

const { database = '', username = '', password = '', host } = connection
const dialect = getDialect()

const DEFAULT_PORT = 3306
const port =
  connection.port && typeof connection.port === 'number'
    ? connection.port
    : DEFAULT_PORT

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port,
  logging: false,
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Connection has been established successfully.')
    logger.info(`DB Name: ${database}`)
  } catch (error) {
    logger.error('Unable to connect to the database: ', error)
  }
}

testConnection()

export default sequelize
