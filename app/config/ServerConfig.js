import path from 'path'
import url from 'url'

import BaseConfig from './BaseConfig'

class ServerConfig extends BaseConfig { }

ServerConfig.Path.PUBLIC    = path.join(ServerConfig.Path.ROOT , 'public')
ServerConfig.Path.TEMPLATES = path.join(ServerConfig.Path.VIEWS, 'templates')

ServerConfig.HOST           = 'localhost'
ServerConfig.PORT           = process.env.PORT || 4000
ServerConfig.DBNAME         = 'kai'

ServerConfig.URI            = { }
ServerConfig.URI.MONGODB    = 'mongodb://' + ServerConfig.HOST + '/' + ServerConfig.DBNAME

export default ServerConfig
