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
            {this.props.messages.map(({id, from, content, datetime}) => <ChatBubble key={id} username={from} content={content} datetime={datetime}/>)}
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
