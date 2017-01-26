import winston from 'winston'

const Logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)()
  ]
})

export default Logger
