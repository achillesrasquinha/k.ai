import React from 'react'

import ChatBubble from './ChatBubble'

class ChatPanel extends React.Component {
  // componentDidMount() {
  //   this.props.populateMessages()
  //             .then((messages) => {
  //
  //             })
  // }

  render() {
    return (
      <div className="chatPanel">
        <div className="panel panel-default no-border no-shadow no-background no-margin no-padding">
          <div className="panel-body no-padding">
            {this.props.messages.map((message) => <ChatBubble key={message.id} message={message}/>)}
          </div>
        </div>
      </div>
    )
  }
}

// ChatPanel.propTypes     = {
//   populateMessages: React.PropTypes.func.isRequired
// }
//
// ChatPanel.defaultProps  = {
//   populateMessages: ( ) => { }
// }

export default ChatPanel
