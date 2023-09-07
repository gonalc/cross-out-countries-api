import { Dialect } from 'sequelize'

export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: number
      LOG_LEVEL?: 'debug' | 'info'
      LOG_DIR?: string
      APP_NAME: string
      APP_VERSION: string
      NODE_ENV?: 'test' | 'production' | 'development' | 'scripts'
      // DB fields
      DB_PORT: string
      DB_CLIENT: Dialect
      DB_HOST: string
      DB_USER: string
      DB_PASSWORD: string
      DB_NAME: string
      // TEST DB fields
      TEST_DB_HOST: string
      TEST_DB_USER: string
      TEST_DB_PASSWORD: string
      TEST_DB_NAME: string
      // Scripts DB fields
      SCRIPTS_DB_HOST: string
      SCRIPTS_DB_USER: string
      SCRIPTS_DB_PASSWORD: string
      SCRIPTS_DB_NAME: string
      // Auth
      SECRET_KEY: string
      ALGORITHM?: import('jsonwebtoken').Algorithm
      // Geocode
      OPEN_CAGE_API: string
      GEONAME_USERNAME: string
    }
  }
}
