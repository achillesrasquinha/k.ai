import { combineReducers } from 'redux'

import user from './reducers/UserReducer'
import messages from './reducers/MessagesReducer'

const Reducers = combineReducers({ messages, user })

export default Reducers
