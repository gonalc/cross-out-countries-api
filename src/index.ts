import app from './app'
import logger from './utils/logger'

const port = app.get('port')

app.listen(port, () => {
  logger.info(`Server running on port: ${port}`)
})
