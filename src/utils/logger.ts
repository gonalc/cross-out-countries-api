import fs from 'fs'
import winston, { format } from 'winston'

import 'winston-daily-rotate-file'

const LOG_DIR = 'logs'
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR)
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
          (info) => `${info.timestamp} - ${info.level} - ${info.message}`
        )
      ),
      level: LOG_LEVEL,
    }),
    new winston.transports.DailyRotateFile({
      format: format.combine(format.timestamp(), format.json()),
      maxFiles: '14d',
      level: LOG_LEVEL,
      dirname: LOG_DIR,
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-debug.log',
    }),
  ],
})

export const logStream = {
  write(message: string | object) {
    logger.info(message.toString())
  },
}

export default logger
