import React from 'react'

import ChatBubble from './ChatBubble'

class ChatPanel extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="chatPanel">
        <div className="panel panel-default no-border no-shadow no-background no-margin no-padding">
          <div className="panel-body no-padding">
            {this.props.messages.map(({id, from, content, datetime}) => <ChatBubble key={id} username={from} content={content} datetime={datetime}/>)}
          </div>
        </div>
      </div>
    )
  }
}

export default ChatPanel
