import axios from 'axios'

import ClientConfig from './../../config/ClientConfig'

const signInRequest = (user) => {
	return dispatch => {
		return axios.post(ClientConfig.URL.API['login_user'], user)
	}
}

export { signInRequest }