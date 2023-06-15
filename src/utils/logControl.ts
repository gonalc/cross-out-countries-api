import fs from 'fs'
import logger from './logger'
import dayjs from 'dayjs'

class LogControl {
  private static basePath = 'logs-control'
  private static datetimeFormat = 'YYYY-MM-DD_HH:mm'

  static createLog(content: string, filename: string, folder: string) {
    this.createFolderIfNeeded(this.basePath)

    const dirPath = `${this.basePath}/${folder}`

    this.createFolderIfNeeded(dirPath)

    const timestamp = this.getTimestampName()
    const filePath = `${dirPath}/${timestamp}_${filename}`

    const writeStream = fs.createWriteStream(filePath)

    writeStream.write(content)

    writeStream.end(() => {
      logger.debug(
        `File: ${filename} has been created in the folder: ${folder}`
      )
    })
  }

  private static createFolderIfNeeded(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  }

  private static getTimestampName() {
    return dayjs().format(this.datetimeFormat)
  }
}

export default LogControl
