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

ServerConfig.APIAI_CLIENT_ACCESS_TOKEN = '726da2be672f4bbbab5a3e180df90d2c'

export default ServerConfig
