const app = require('./src/app')
const http = require('http')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {

  const port = config.PORT || 5000

  logger.info(`Serveur en cours sur le port ${port}`)
})