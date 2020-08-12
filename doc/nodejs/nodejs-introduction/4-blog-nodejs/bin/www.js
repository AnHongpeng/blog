/**
 * @File：Create Server 的逻辑
 */

const http = require('http')

const PORT = 8000
const serverHandler = require('../app')

const server = http.createServer(serverHandler)
server.listen(PORT)
