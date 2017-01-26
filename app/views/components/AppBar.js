import React from 'react'
import classnames from 'classnames'

import ClientConfig from './../../config/ClientConfig'

class AppBar extends React.Component {
  render() {
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
                  <a href={ClientConfig.URL.SIGNIN}>Sign In</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AppBar.defaultProps = {
  fixed: false
}

export default AppBar
