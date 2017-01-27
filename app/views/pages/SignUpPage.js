import React from 'react'
import { connect } from 'react-redux'

import ClientConfig from './../../config/ClientConfig'
import AppBar from './../components/AppBar'
import SignUpForm from './../components/account/SignUpForm'
import SocialLoginForm from './../components/account/SocialLoginForm'
import { signUpRequest } from './../../client/actions/SignUpActions'

class SignUpPage extends React.Component {
  render() {
    return (
      <div className="signUpPage">
        <AppBar/>
        <div className="container">
          <div className="text-center">
            <h2 className="font-light">Create your <span className="logo-brand">{ClientConfig.App.NAME}</span> account</h2>
          </div>
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <SignUpForm onSubmit={this.props.signUpRequest}/>
              <h4 className="text-center font-bold">or</h4>
              <SocialLoginForm/>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    )
  }
}

SignUpPage.propTypes     = {
  signUpRequest:   React.PropTypes.func.isRequired
}

SignUpPage.defaultProps  = {
  signUpRequest:   ( ) => { }
}

const mapStateToProps    = (state) => state

export default connect(mapStateToProps, { signUpRequest })(SignUpPage)
