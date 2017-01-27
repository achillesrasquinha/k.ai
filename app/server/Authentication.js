import jwt from 'jsonwebtoken'

import ServerConfig from './../config/ServerConfig'

const createUserToken = (user) => {
  const token = jwt.sign({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  }, ServerConfig.JWT_SECRET)

  return token
}

export { createUserToken }
