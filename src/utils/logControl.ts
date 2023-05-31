import fs from 'fs'
import logger from './logger'

class LogControl {
  private static basePath = 'logs-control'

  static createLog(content: string, filename: string, folder: string) {
    const dirPath = `${this.basePath}/${folder}`

    this.createFolderIfNeeded(dirPath)

    const filePath = `${dirPath}/${filename}`

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
}

export default LogControl
