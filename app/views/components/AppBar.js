import React from 'react'
import _ from 'lodash'
import classnames from 'classnames'

import ClientConfig from './../../config/ClientConfig'

class AppBar extends React.Component {
  constructor() {
    super()

    this.onSignOut = this.onSignOut.bind(this)
  }

  onSignOut(event) {
    if ( !event.isDefaultPrevented() ) {
      event.preventDefault()
    }

    this.props.onSignOut()
  }

  render() {
    const userLinks  = (
      <a href="#" onClick={this.onSignOut}>Sign Out</a>
    )

    const guestLinks = (
      <a href={ClientConfig.URL.SIGNIN}>Sign In</a>
    )

    return (
      <div className="appBar">
        <div className={classnames("navbar navbar-default no-border-radius", { "navbar-fixed-top": this.props.fixed })}>
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#appBar-collapse" aria-expanded="false">
                <i className="fa fa-fw fa-menu"></i>
              </button>
              <a className="logo-brand navbar-brand" href={ClientConfig.URL.BASE}>
                {ClientConfig.App.NAME}
              </a>
            </div>
            <div id="appBar-collapse" className="appBar-collapse collapse navbar-collapse font-bold text-uppercase">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  {!_.isEmpty(this.props.user) ? userLinks : guestLinks}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AppBar.propTypes      = {
  user:      React.PropTypes.object.isRequired,
  onSignOut: React.PropTypes.func.isRequired
}

AppBar.defaultProps   = {
  user:      { },
  onSignOut: ( ) => { },
  fixed:     false
}

export default AppBar
