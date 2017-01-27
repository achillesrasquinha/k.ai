import { POPULATE_MESSAGES } from './../actions/ActionTypes'

const defaultState    = { messages: [ ] }

const messages        = (state = defaultState, action = { }) => {
  switch (action.type) {
    case POPULATE_MESSAGES:
      return [...state, ...action.messages]

    default:
      return state
  }
}

export default messages
