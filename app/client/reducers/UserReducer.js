import { SET_CURRENT_USER } from './../actions/ActionTypes'

const defaultState = { user: { } }

const UserReducer  = (state = defaultState, action = { }) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { user: action.user }

    default:
      return state
  }
}

export default UserReducer
