import axios from 'axios'
import jwt from 'jsonwebtoken'

import ClientConfig from './../../config/ClientConfig'
import { setAuthorizationToken } from './../../utils/Authorization'
import { SET_CURRENT_USER } from './ActionTypes'

const setCurrentUser = (user) => {
	return {
		type: SET_CURRENT_USER,
		user: user
	}
}

const signInRequest = (user) => {
	return dispatch => {
		return axios.post(ClientConfig.URL.API['signin_user'], user)
								.then((res) => {
									const token   = res.data.token
									const decoded = jwt.decode(token)

									localStorage.setItem('jwt', token)

									setAuthorizationToken(token)

									dispatch(setCurrentUser(decoded))
								})
	}
}

const signOut      = () => {
	return dispatch => {
		localStorage.removeItem('jwt')
		setAuthorizationToken(null)

		dispatch(setCurrentUser({ }))
	}
}

export { signInRequest, signOut, setCurrentUser }
