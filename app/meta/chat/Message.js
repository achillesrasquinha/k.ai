import moment from 'moment'
import uuid from 'uuid'

class Message {
  constructor(from, content) {
    this.ID       = uuid()
    this.from     = from
    this.content  = content
    this.datetime = moment().utc().format()

    this.message = {
      id: this.ID,
      from: this.from,
      content: content,
      datetime: this.datetime
    }

    return this.message
  }
}

export default Message
