import axios from 'axios'

import ClientConfig from './../../config/ClientConfig'

const signInRequest = (user) => {
	return dispatch => {
		return axios.post(ClientConfig.URL.API['signin_user'], user)
								.then((res) => {
									const token = res.data.token
									localStorage.setItem('jwt', token)
								})
	}
}

export { signInRequest }
