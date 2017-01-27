import axios from 'axios'

import ClientConfig from './../../config/ClientConfig'

const getMessages = (limit = 100) => {
	return dispatch => {
    return axios.post(ClientConfig.URL.API['message_history'], limit)
                .then((res) => {
                  console.log(res)
                })
	}
}

const sendMessage = (message) => {
	return dispatch => {
		return axios.post(ClientConfig.URL.API['send_message'], message)
								.then((res) => {
									console.log(res)
								})
	}
}

export { getMessages, sendMessage }
