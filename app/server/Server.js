import express from 'express'
import session from 'express-session'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import SocketIO from 'socket.io'
import Request from 'request'
import cheerio from 'cheerio'
import mongodb from 'mongodb'
import mongoose from 'mongoose'
import apiai from 'apiai'
import _ from 'lodash'

import ServerConfig from './../config/ServerConfig'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import WebpackConfig from './../../webpack.config'
import Message from './../meta/chat/Message'
import Stock from './../meta/stock/Stock'
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
app.use(session({
  secret: ServerConfig.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}))

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
  connections.push(socket)

  Logger.info('A connection has occured')
  Logger.info('Connections: ' + connections.length)

  socket.on('disconnect', (socket) => {
    _.remove(connections, socket)

    Logger.info('A user has disconnected')
    Logger.info('Connections: ' + connections.length)
  })

  socket.on('chat message', (message) => {
    Logger.info('Recieved message: ' + JSON.stringify(message))

    const sessionID = socket.id

    Logger.info('Session ID: ' + sessionID)

    const appai     = apiai(ServerConfig.kai.APIAI_CLIENT_ACCESS_TOKEN)
    const request   = appai.textRequest(message.content, {
      sessionId: sessionID
    })

    request.on('response', (response) => {
      Logger.info('Recieved response from api.ai: ' + JSON.stringify(response))

      const content = response.result.fulfillment.speech
      const intent  = response.metadata.intentName

      if ( content == ServerConfig.kai.WATERFALL_COMPLETE ) {
        Logger.info('Recieved all k.ai parameters')

        if ( intent == ServerConfig.kai.STOCK_RECOMMENDATION ) {
          const type  = response.result.parameters['stock-status']
          const path  = type == Stock.Type.GAIN ? '/gainers?e=ns' : '/losers?e=ns'

          Request({ url: ServerConfig.kai.URL_YAHOO_FINANCE + path }, (err, response, body) => {
            let $         = cheerio.load(body)
            const stocks  = [ ]

            $('#yfitp tbody tr').each((i, element) => {
              let   symbol    = $('.first b a', element).text()
              let   valueID   = `yfs_c63_${symbol.toLowerCase()}`
              let   percentID = `yfs_p43_${symbol.toLowerCase()}`

              try {
                symbol              = symbol.replace('.NS', '')
                // some issue out here
                // const valueChange   = $(`#${valueID} b`, element).text()
                // const percentChange = $(`#${percentID} b`, element).text()

                // stub
                const valueChange   = (Math.random() * 20).toFixed(2)
                const percentChange = (Math.random() * 30).toFixed(2)

                const valueLast     = $(`.last_trade b span`, element).text()
                const datetimeLast  = $(`.last_trade nobr span`, element).text()

                const meta   = {
                  last: {
                    value: valueLast,
                    datetime: datetimeLast
                  },
                  change: {
                    value: valueChange,
                    percent: percentChange,
                    type: type
                  }
                }
                const stock  = new Stock(symbol, meta)

                stocks.push(stock)
              } catch (e) { }
            })
            const htmlString = Stock.toHTMLString(stocks.splice(0, ServerConfig.kai.MAX_STOCK_RESULTS))
            const _content = 'Here is a list of ' + ServerConfig.kai.MAX_STOCK_RESULTS + ' stocks.' + htmlString
            const message  = new Message(ServerConfig.kai.NAME, _content)

            socket.emit('chat message', message)
          } else if ( intent == ServerConfig.kai.STOCK_TRADE ) {
            const stockID    = response.result.parameters['stock-id']
            const tradeType  = response.result.parameters['stock-trade']
            const stockUnits = response.result.parameters['stock-units'].units
          }
        })
      } else {
        const message = new Message(ServerConfig.kai.NAME, content)
        socket.emit('chat message', message)
      }
    })

    request.on('error'   , (error) => {
      Logger.info('Recieved error from api.ai: ' + JSON.stringify(error))
    })

    request.end()
  })
})
