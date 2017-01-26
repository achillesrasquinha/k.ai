import moment from 'moment'
import uuid from 'uuid'

class Message {
  constructor(content) {
    this.ID       = uuid()
    this.content  = content
    this.datetime = moment().utc().format()

    this.message = {
      id: this.ID,
      from: 'k.ai',
      content: content,
      datetime: this.datetime
    }

    return this.message
  }
}

export default Message
