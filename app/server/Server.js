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
import jwt from 'jsonwebtoken'
import GoogleFinance from 'google-finance'
import HJSON from 'hjson'

import ServerConfig from './../config/ServerConfig'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import WebpackConfig from './../../webpack.config'
import User from './../models/account/User'
import Message from './../meta/chat/Message'
import Stock from './../meta/stock/Stock'
import TradeOrder from './../meta/stock/TradeOrder'
import Portfolio from './../meta/stock/Portfolio'
import News from './../meta/stock/News'
import StockDetails from './../meta/stock/StockDetails'
import { signUpUserRouter, signInUserRouter } from './Routers'
import Logger from './../utils/Logger'

const app         = express()
const server      = new http.Server(app)
const io          = SocketIO(server)

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
    const token     = message.token
    let   user      = { }

    if ( token ) {
      user = jwt.decode(token)
    }

    Logger.info('Session ID: ' + sessionID)
    Logger.info('Currently user ' + JSON.stringify(user) + ' is in session')

    const appai     = apiai(ServerConfig.kai.APIAI_CLIENT_ACCESS_TOKEN)
    const request   = appai.textRequest(message.content, {
      sessionId: sessionID
    })

    request.on('response', (response) => {
      Logger.info('Recieved response from api.ai: ' + JSON.stringify(response))

      const content = response.result.fulfillment.speech
      const intent  = response.result.metadata.intentName

      if ( content == ServerConfig.kai.WATERFALL_COMPLETE ) {
        Logger.info('Recieved all k.ai parameters')

        if ( intent == ServerConfig.kai.STOCK_RECOMMENDATION ) {
          Logger.info('Stock recommendation intent recieved')
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
          })
        } else if ( intent == ServerConfig.kai.STOCK_TRADE ) {
          const stockID     = response.result.parameters['stock-id']
          const tradeType   = response.result.parameters['stock-trade']
          const stockUnits  = response.result.parameters['stock-units'].units

          Request.get({ url:'http://finance.google.com/finance/info?client=ig&q=NSE:' + stockID}, (err, response, body) => {
            Logger.info('response from google finance: ' + body)

            let hack     = body.replace('//', '')
                hack     = hack.replace('[' , '')
                hack     = hack.replace(']' , '')
            let result   = JSON.stringify(eval('(' + hack + ')'))
                result   = JSON.parse(result)

            if ( err ) {
              throw err
              // you may have to respond the user
            } else {
              Logger.info('JSON result: ' + JSON.stringify(result))
              const tradePrice = parseFloat(result.l_fix)
              Logger.info('trading price: ' + tradePrice)
              const tradeOrder = new TradeOrder(stockID, tradeType, stockUnits, tradePrice)

              Logger.info("User's query is " + JSON.stringify(tradeOrder))

              User.getUserByID(user.id, (err, u) => {
                if ( err ) {
                  throw err
                } else {
                  if ( u ) {
                    Logger.info('Recieved user: ' + JSON.stringify(u))
                    Logger.info('Stock Profile recieved: ' + JSON.stringify(u.portfolio))

                    if ( _.isEmpty(u.portfolio.stocks) ) {
                      Logger.info('User has no current stocks traded')

                      if ( tradeOrder.type == TradeOrder.Type.SELL ) {
                        const content = 'Sorry, you have no stocks to sell.'
                        const message = new Message(ServerConfig.kai.NAME, content)
                        socket.emit('chat message', message)
                      } else {
                        const content = TradeOrder.toHTMLString(tradeOrder)
                        const message = new Message(ServerConfig.kai.NAME, content)
                        socket.emit('chat message', message)

                        User.updatePortfolio(u, tradeOrder, (err, u) => {})
                      }
                    } else {
                      Logger.info('User has some stocks')
                      User.updatePortfolio(u, tradeOrder, (err, u) => {})
                      const content = TradeOrder.toHTMLString(tradeOrder)
                      const message = new Message(ServerConfig.kai.NAME, content)
                      socket.emit('chat message', message)
                    }
                  } else {
                    const content = "Whoops! We can't seem to find you. Have you registered yet?"
                    const message = new Message(ServerConfig.kai.NAME, content)

                    socket.emit('chat message', message)
                  }
                }
              })
            }
          })
        } else if ( intent == ServerConfig.kai.PORTFOLIO_DESCRIPTION ) {
          User.getUserByID(user.id, (err, u) => {
            const stockIDs = u.portfolio.stocks.map((stock) => {
              return stock.stockID
            }).join(',')

            Request.get({ url:'http://finance.google.com/finance/info?client=ig&q=NSE:' + stockIDs}, (err, response, body) => {
              Logger.info('response from google finance: ' + body)

              let hack     = body.replace('//', '')
                  hack     = hack.replace('[' , '')
                  hack     = hack.replace(']' , '')
              let result   = JSON.stringify(eval('(' + hack + ')'))
                  result   = JSON.parse(result)

              if ( err ) {
                throw err
                // you may have to respond the user
              } else {
                Logger.info('JSON result: ' + JSON.stringify(result))

                const content   = Portfolio.toHTMLString(u.portfolio, result)
                const message   = new Message(ServerConfig.kai.NAME, content)

                socket.emit('chat message', message)
              }
            })
          })
        } else if ( intent == ServerConfig.kai.STOCK_DETAILS ) {
          Logger.info('entered into a successful stockDetails intent')

          const stockID     = response.result.parameters['stock-id']
          const displayCard = response.result.parameters['stock-news']

          Logger.info('stockID: '     + stockID)
          Logger.info('displayCard: ' + displayCard)

          Request.get({ url:'http://finance.google.com/finance/info?client=ig&q=NSE:' + stockID}, (err, res, body) => {
            Logger.info('response from google finance: ' + body)

            let hack     = body.replace('//', '')
            let result   = JSON.stringify(eval('(' + hack + ')'))
                result   = JSON.parse(result)

            if ( err ) {
              throw err
              // you may have to respond the user
            } else {
              Logger.info('JSON result: ' + JSON.stringify(result))

              const content   = StockDetails.toHTMLString(result[0])
              const message   = new Message(ServerConfig.kai.NAME, content)

              socket.emit('chat message', message)
            }
          })

          if ( displayCard ) {
            GoogleFinance.companyNews({
              symbol: 'NSE:' + stockID
            }, (err, news) => {
              const content  = News.toHTMLString(news[0])
              const message  = new Message(ServerConfig.kai.NAME, content)

              socket.emit('chat message', message)
            })
          }
        }
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
