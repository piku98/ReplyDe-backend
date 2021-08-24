const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const { socketManager } = require('./controllers/socketManager')
let { socketInfo } = require('./data')

const app = express()

const server = http.createServer(app)

const io = socketio(server)

socketManager(io)


const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`listening at ${PORT}`))