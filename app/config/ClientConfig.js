import path from 'path'

import BaseConfig from './BaseConfig'

class ClientConfig extends BaseConfig { }

ClientConfig.Path.BASE = path.join(ClientConfig.Path.ROOT, 'client')

ClientConfig.App.ID    = 'app'

export default ClientConfig
