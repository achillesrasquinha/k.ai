import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import jwt from 'jsonwebtoken'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import ClientConfig from './../config/ClientConfig'
import { setAuthorizationToken } from './../utils/Authorization'
import { setCurrentUser } from './actions/SignInActions'
import Routes from './Routes'
import Reducers from './Reducers'

const appContainer = document.getElementById(ClientConfig.App.ID)
const reduxLogger  = logger()
const middleware   = applyMiddleware(thunk, reduxLogger)
const store        = createStore(Reducers, middleware)

if ( localStorage.jwt ) {
  const token   = localStorage.jwt
  const decoded = jwt.decode(token)

  setAuthorizationToken(token)

  store.dispatch(setCurrentUser(decoded))
}

const appProvider  = (
  <Provider store={store}>
    <Router
      history={browserHistory}
      children={Routes}/>
  </Provider>
)

ReactDOM.render(appProvider, appContainer)
