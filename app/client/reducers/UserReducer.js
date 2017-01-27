import { SET_CURRENT_USER } from './../actions/ActionTypes'

const defaultState = { user: { } }

const user         = (state = defaultState, action = { }) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.user

    default:
      return state
  }
}

export default user
