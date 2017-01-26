import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import ClientConfig from './../config/ClientConfig'
import Routes from './Routes'
import Reducers from './Reducers'

const appContainer = document.getElementById(ClientConfig.App.ID)
const reduxLogger  = logger()
const middleware   = applyMiddleware(thunk, reduxLogger)
const store        = createStore(Reducers, middleware)
const appProvider  = (
  <Provider store={store}>
    <Router
      history={browserHistory}
      children={Routes}/>
  </Provider>
)

ReactDOM.render(appProvider, appContainer)
