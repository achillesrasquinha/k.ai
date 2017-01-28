import path from 'path'
import url from 'url'
import uuid from 'uuid'

import BaseConfig from './BaseConfig'

class ServerConfig extends BaseConfig { }

ServerConfig.Path.PUBLIC    = path.join(ServerConfig.Path.ROOT , 'public')
ServerConfig.Path.TEMPLATES = path.join(ServerConfig.Path.VIEWS, 'templates')

ServerConfig.HOST           = 'localhost'
ServerConfig.PORT           = process.env.PORT || 4000
ServerConfig.DBNAME         = 'kai'

ServerConfig.JWT_SECRET     = 'SECRET'
ServerConfig.SESSION_SECRET = 'SECRET'

ServerConfig.URI            = { }
ServerConfig.URI.MONGODB    = 'mongodb://' + ServerConfig.HOST + '/' + ServerConfig.DBNAME


ServerConfig.kai                           = { }
ServerConfig.kai.NAME                      = 'k.ai'
ServerConfig.kai.WATERFALL_COMPLETE        = 'waterfall-complete'
ServerConfig.kai.STOCK_RECOMMENDATION      = 'stockRecommendation'
ServerConfig.kai.STOCK_TRADE               = 'stockTrade'
ServerConfig.kai.APIAI_CLIENT_ACCESS_TOKEN = '061f82eb5d3d4ceeb0943bed5eafb2e3'
ServerConfig.kai.URL_YAHOO_FINANCE         = 'https://in.finance.yahoo.com/'
ServerConfig.kai.MAX_STOCK_RESULTS         = 5

export default ServerConfig
