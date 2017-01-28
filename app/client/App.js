import React from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import AppBar from './../views/components/AppBar'
import ChatPanel from './../views/components/chat/ChatPanel'
import ChatForm from './../views/components/chat/ChatForm'
import { signOut } from './actions/SignInActions'
import { getMessages, saveMessage } from './actions/MessageActions'

class App extends React.Component {
  constructor() {
    super()

    this.onSubmit = this.onSubmit.bind(this)
    this.socket   = io()

    this.state    = App.defaultStates
  }

  componentDidMount() {
    this.socket.on('chat message', (message) => {
      const messages = [...this.state.messages, message]

      this.setState({ messages })
    })
  }

  onSubmit(message) {
    this.socket.emit('chat message', message)

    // this.props.sendMessage(message)

    const messages = [...this.state.messages, message]
    this.setState({ messages })
  }

  render() {
    return (
      <div className="chatScreen">
        <AppBar fixed={true} onSignOut={this.props.signOut} user={this.props.user}/>
        <div className="jumbotron">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <ChatPanel messages={this.state.messages}/>
              </div>
              <div className="col-md-3"></div>
            </div>
          </div>
        </div>
        <ChatForm user={this.props.user} onSubmit={this.onSubmit}/>
      </div>
    )
  }
}

App.propTypes    = {
  user:        React.PropTypes.object.isRequired,
  signOut:     React.PropTypes.func.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  saveMessage: React.PropTypes.func.isRequired
}

App.defaultProps = {
  user:        { },
  signOut:     ( ) => { },
  getMessages: ( ) => { },
  saveMessage: ( ) => { }
}

App.defaultStates     = {
  messages: [ ]
}

const mapStateToProps = (state) => {
  return {
    user:     state.user,
    messages: state.messages
  }
}

export default connect(mapStateToProps, { signOut, getMessages, saveMessage })(App)
