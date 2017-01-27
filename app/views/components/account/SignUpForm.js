import React from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import moment from 'moment'
import 'eonasdan-bootstrap-datetimepicker'

import ClientConfig from './../../../config/ClientConfig'
import { validateUser } from './../../../utils/Validators'
import Countries from './../../../data/Countries'
import Sex from './../../../data/Sex'
import InputGroup from './../InputGroup'

class SignUpForm extends React.Component {
  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state    = SignUpForm.defaultStates
  }

  componentWillMount() {
    $('.selectpicker').change(() => {
      const $option = $(this).find('option:selected')
      const value   = $option.val()

      $(this).attr('value', value)
    })
  }

  componentDidMount() {
    const that    = this
    const options = { format: 'MMMM Do, YYYY', defaultDate: moment(), ignoreReadonly: true,
      widgetPositioning: { horizontal: 'left', vertical: 'bottom' } }

    $('#datetimepicker').datetimepicker(options)
    $('#datetimepicker').on('dp.change', (event) => {
      const value = moment(event.date).format('MMMM Do, YYYY')

      that.onChange({ target: { name: 'birthDate', value: value } })
    })
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
                 .then(( )   => {
                          this.context.router.push(ClientConfig.URL.BASE)
                        },
                       (err) => { this.setState({ errors: err.response.data.errors, isLoading: false }) })
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} onChange={this.onChange}>
        <div className="row">
          <div className="col-md-6">
            <InputGroup
              label="First Name"
              error={this.state.errors.firstname}
              id="signUpFirstName"
              name="firstname"
              value={this.state.firstname}
              onChange={this.onChange}/>
          </div>
          <div className="col-md-6">
            <InputGroup
              label="Last Name"
              error={this.state.errors.lastname}
              id="signUpLastName"
              name="lastname"
              value={this.state.lastname}
              onChange={this.onChange}/>
          </div>
        </div>
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
        <InputGroup
          label="Confirm Password"
          error={this.state.errors.confirmPassword}
          id="signUpconfirmPassword"
          name="confirmPassword"
          type="password"
          value={this.state.confirmPassword}
          onChange={this.onChange}/>
        <div className="row">
          <div className="col-md-7">
            <div className={classnames("form-group", { "has-error": this.state.errors.birthDate })}>
              <label htmlFor="signUpBirthDate" className="control-label">Birthday</label>
              <div id="datetimepicker" className="input-group date">
                <input type="text" className="form-control"
                  readOnly
                  value={this.state.birthDate}
                  name="birthDate"/>
                <div className="input-group-addon">
                  <i className="fa fa-fw fa-calendar"></i>
                </div>
              </div>
              {this.state.errors.birthDate && <span className="help-block">{this.state.errors.birthDate.message}</span>}
            </div>
          </div>
          <div className="col-md-5">
            <div className={classnames("form-group", { "has-error": this.state.errors.sexCode })}>
              <label htmlFor="signUpGender" className="control-label">Gender</label>
              <select onChange={this.onChange} className="selectpicker form-control" name="sexCode" title="I am" value={this.state.sexCode} data-style="btn-warning">
                {Sex.map(({name, code}) => <option key={code} value={code}>{name.common}</option>)}
              </select>
              {this.state.errors.sexCode && <span className="help-block">{this.state.errors.sexCode.message}</span>}
            </div>
          </div>
        </div>
        <div className={classnames("form-group", { "has-error": this.state.errors.countryCode })}>
          <label htmlFor="signUpLocation" className="control-label">Location</label>
          <select onChange={this.onChange} className="selectpicker form-control show-tick show-menu-arrow" data-style="btn-warning" value={this.state.countryCode} data-live-search="true" name="countryCode" data-size="5" title="Choose a location...">
            {Countries.map(({name, cca2}) => <option key={cca2} value={cca2}>{name.common}</option>)}
          </select>
          {this.state.errors.sexCode && <span className="help-block">{this.state.errors.countryCode.message}</span>}
        </div>
        {/*
        <div className="form-group">
          <label htmlFor="signUpContact" className="control-label">Contact</label>
          <input id="signUpContact" className="form-control" name="contact"  value={this.state.contact}/>
        </div>
        */}
        <div className="form-group">
          <button id="signUpButton" disabled={this.state.isLoading} className="btn btn-default btn-block  font-bold text-uppercase" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    )
  }
}

SignUpForm.propTypes     = {
  onSubmit: React.PropTypes.func.isRequired
}

SignUpForm.contextTypes  = {
  router:   React.PropTypes.object.isRequired
}

SignUpForm.defaultProps  = {
  onSubmit: ( ) => { }
}

SignUpForm.defaultStates = {
  firstname: "", lastname: "",
  email: "",
  password: "", confirmPassword: "",
  birthDate: "", sexCode: "",
  countryCode: "",
  // contact: ""
  errors: { },
  isLoading: false
}

export default SignUpForm
