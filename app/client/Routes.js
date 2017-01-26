import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ClientConfig from './../config/ClientConfig'
import App from './App'
import SignInPage from './../views/pages/SignInPage'
import SignUpPage from './../views/pages/SignUpPage'

const Routes  = (
  <Route path = {ClientConfig.URL.BASE}>
    <IndexRoute component={App}/>
    <Route path={ClientConfig.URL.SIGNIN} component={SignInPage}/>
    <Route path={ClientConfig.URL.SIGNUP} component={SignUpPage}/>
  </Route>
)

export default Routes
