import React from 'react'

import Message from './../../../meta/chat/Message'

class ChatForm extends React.Component {
  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state    = ChatForm.defaultStates
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmit(event) {
    if (!event.isDefaultPrevented()) {
      event.preventDefault()
    }

    if ($.trim(this.state.content).length > 0) {
      const message = new Message(this.props.user.firstname, this.state.content, localStorage.jwt)

      this.props.onSubmit(message)

      this.setState(ChatForm.defaultStates)
    }
  }

  render() {
    return (
      <form className="chatForm navbar-fixed-bottom" onSubmit={this.onSubmit} onChange={this.onChange}>
        <div className="panel panel-default no-margin no-border no-shadow no-background">
          <div className="panel-body">
            <div className="input-group input-group-lg">
              <div className="input-group-btn">
                <button className="btn btn-default ">
                  <i className="fa fa-fw fa-smile-o"></i>
                </button>
              </div>
              <input className="form-control" autoComplete="off" name="content" placeholder="Type a message..." value={this.state.content}/>
              <div className="input-group-btn">
                <button className="btn btn-default ">
                  <i className="fa fa-fw fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

ChatForm.defaultStates = {
  content: ""
}

ChatForm.propTypes     = {
  user:     React.PropTypes.object.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

ChatForm.defaultProps  = {
  user:     { },
  onSubmit: ( ) => { }
}

export default ChatForm
