import React from 'react'
import { connect } from 'react-redux'

import ClientConfig from './../../config/ClientConfig'
import SignInForm from './../components/account/SignInForm'
import SocialLoginForm from './../components/account/SocialLoginForm'
import { signInRequest } from './../../client/actions/SignInActions'

class SignInPage extends React.Component {
  render() {
    return (
      <div className="signInPage">
        <div className="container">
          <div className="text-center">
            <div className="page-header no-border">
              <a className="no-decoration" href={ClientConfig.URL.BASE}>
                <h1 className="logo-brand">{ClientConfig.App.NAME}</h1>
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <SignInForm onSubmit={this.props.signInRequest}/>
              <h4 className="text-center font-bold">or</h4>
              <SocialLoginForm/>
            </div>
            <div className="col-md-4"></div>
          </div>
          <div className="text-center">
            <a className="no-decoration" href={ClientConfig.URL.SIGNUP}>
              <h4>Create an account</h4>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

SignInPage.propTypes     = {
  signInRequest: React.PropTypes.func.isRequired
}

SignInPage.defaultProps  = {
  signInRequest: ( ) => { }
}

const mapStateToProps    = (state) => state

export default connect(mapStateToProps, { signInRequest })(SignInPage)
