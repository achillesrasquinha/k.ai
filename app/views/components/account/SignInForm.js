import React from 'react'

import ClientConfig from './../../../config/ClientConfig'
import { validateUser } from './../../../utils/Validators'
import InputGroup from './../InputGroup'

class SignInForm extends React.Component {
  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state    = SignInForm.defaultStates
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

    const response = validateUser(this.state)

    if ( _.isEqual(response.status, ClientConfig.App.Status.VALIDATION_ERROR) ) {
      this.setState({
        errors: response.errors
      })
    }

    if ( _.isEqual(response.status, ClientConfig.App.Status.VALIDATION_SUCCESS) ) {
       this.setState({
          errors: { },
          isLoading: true
       })

       this.props.onSubmit(this.state)
                 .then(( )   => { this.context.router.push(ClientConfig.URL.BASE) },
                       (err) => { this.setState({ errors: err.response.data.errors, isLoading: false }) })
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <InputGroup
          label="Email"
          error={this.state.errors.email}
          id="signUpEmail"
          name="email"
          value={this.state.email}
          onChange={this.onChange}/>
        <InputGroup
          label="Password"
          error={this.state.errors.password}
          id="signUpPassword"
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.onChange}/>
        <div className="form-group">
          <button disabled={this.state.isLoading} id="signInButton" className="btn btn-default btn-block  font-bold text-uppercase" type="submit">
            Sign In
          </button>
        </div>
      </form>
    )
  }
}

SignInForm.propTypes    = {
  onSubmit: React.PropTypes.func.isRequired
}

SignInForm.contextTypes  = {
  router: React.PropTypes.object.isRequired
}

SignInForm.defaultProps = {
  onSubmit: ( ) => { }
}

SignInForm.defaultStates = {
  email: "",
  password: "",
  errors: { },
  isLoading: false
}

export default SignInForm
