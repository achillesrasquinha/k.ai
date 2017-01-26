import React from 'react'

class SocialLoginForm extends React.Component {
  constructor() {
    super()

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(event) {
    if (!event.isDefaultPrevented()) {
      event.preventDefault()
    }
  }

  render() {
    return (
      <div className="socialLoginForm">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <button className="btn btn-block btn-social btn-facebook">
              <i className="fa fa-fw fa-facebook"></i> Connect using Facebook
            </button>
          </div>
          <div className="form-group">
            <button className="btn btn-block btn-social btn-google">
              <i className="fa fa-fw fa-google"></i> Connect using Google
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default SocialLoginForm
