import React from 'react'
import moment from 'moment'

class ChatBubble extends React.Component {
  constructor() {
    super()

    this.createHTML = this.createHTML.bind(this)
  }

  createHTML(string) {
    return {
      __html: string
    }
  }

  render() {
    const message  = this.props.message
    const username = message.from
    const content  = message.content
    const time     = moment(message.datetime).local().format('hh:mm a')

    return (
      <div className="chatBubble">
        <div className="well well-sm">
          <div className="chatBubble-username">
            <h4 className="font-bold">{username}</h4>
          </div>
          <div className="chatBubble-content">
            <div dangerouslySetInnerHTML={ this.createHTML(content) }/>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="pull-left">
                <div className="chatBubble-timestamp">
                  <small><em>{time}</em></small>
                </div>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="pull-right">
                <div className="chatBubble-status">
                  <i className="fa fa-fw fa-spinner"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChatBubble
