import express from 'express'
import session from 'express-session'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import SocketIO from 'socket.io'
import mongodb from 'mongodb'
import mongoose from 'mongoose'

import ServerConfig from './../config/ServerConfig'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import WebpackConfig from './../../webpack.config'
import { signUpUserRouter, signInUserRouter } from './Routers'
import Logger from './../utils/Logger'

const app         = express()
const server      = new http.Server(app)
const io          = SocketIO(server)

mongoose.Promise  = global.Promise
mongoose.connect(ServerConfig.URI.MONGODB)

const db          = mongoose.connection

const compiler    = webpack(WebpackConfig)

let   connections = [ ]

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  publicPath: WebpackConfig.output.publicPath,
  noInfo: true
}))
app.use(webpackHotMiddleware(compiler))
app.use(express.static(ServerConfig.Path.PUBLIC))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(ServerConfig.URL.API['signup_user'], signUpUserRouter)
app.use(ServerConfig.URL.API['signin_user'], signInUserRouter)

app.set('view engine', 'pug')
app.set('views', ServerConfig.Path.TEMPLATES)

app.get(ServerConfig.URL.BASE + '*', (req, res) => {
  res.render('index', {
    title: ServerConfig.App.TITLE.index,
    pretty: true
  })
})

server.listen(ServerConfig.PORT, (err) => {
  if (err) {
    Logger.info('Error in listening to PORT ' + ServerConfig.PORT + ': ' + err)
  } else {
    Logger.info('Listening to PORT: ' + ServerConfig.PORT)
  }
})

io.sockets.on('connection', (socket) => {
  Logger.info('A connection has occured')

  connections.push(socket)

  socket.on('disconnect', (socket) => {
    Logger.info('A user has disconnected')
  })

  socket.on('client message', (message) => {
    Logger.info('Recieved message: ' + JSON.stringify(message))
  })
})
