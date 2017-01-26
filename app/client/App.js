import React from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import AppBar from './../views/components/AppBar'
import ChatPanel from './../views/components/chat/ChatPanel'
import ChatForm from './../views/components/chat/ChatForm'

class App extends React.Component {
  constructor() {
    super()

    this.onSubmit = this.onSubmit.bind(this)
    this.socket   = io()

    this.state    = App.defaultStates
  }

  onSubmit(message) {
    this.socket.emit('client message', message)


    const messages = [...this.state.messages, message]
    this.setState({ messages })
  }

  render() {
    return (
      <div className="chatScreen">
        <AppBar fixed={true}/>
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
        <ChatForm onSubmit={this.onSubmit}/>
      </div>
    )
  }
}

App.defaultStates     = {
  messages: [ ]
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(App)
