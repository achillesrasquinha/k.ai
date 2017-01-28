import moment from 'moment'
import uuid from 'uuid'

class Message {
  constructor(from, content, token = null) {
    this.ID       = uuid()
    this.from     = from
    this.content  = content
    this.datetime = moment().utc().format()
    this.token    = token

    this.message = {
      id: this.ID,
      from: this.from,
      content: content,
      datetime: this.datetime,
      token: this.token
    }

    return this.message
  }
}

export default Message
