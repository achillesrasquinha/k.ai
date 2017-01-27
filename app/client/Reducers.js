import { combineReducers } from 'redux'

import UserReducer from './reducers/UserReducer'
import MessagesReducer from './reducers/MessagesReducer'

const Reducers = combineReducers({ MessagesReducer, UserReducer })

export default Reducers
