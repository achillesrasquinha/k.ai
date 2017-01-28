import express from 'express'
import _ from 'lodash'

import ServerConfig from './../config/ServerConfig'
import { validateUser } from './../utils/Validators'
import User from './../models/account/User'
import Logger from './../utils/Logger'
import { createUserToken } from './Authentication.js'

const signUpUserRouter = express.Router()
const signInUserRouter = express.Router()

signUpUserRouter.post(ServerConfig.URL.SEPERATOR, (req, res) => {
	const user      = req.body

	Logger.info('Recieved user registration data: ' + JSON.stringify(user))

	let   response  = validateUser(user)

	if ( _.isEqual(response.status, ServerConfig.App.Status.VALIDATION_SUCCESS) ) {
		User.getUserByEmail(user.email, (err, u) => {
			if ( err ) {
				throw err
				res.status(500).json({ status: ServerConfig.App.Status.REGISTRATION_FAILURE })
			} else {
				if ( u ) {
					response.status       = ServerConfig.App.Status.VALIDATION_ERROR
					response.errors.email = ServerConfig.App.Error.EMAIL_ADDRESS_EXISTS
					res.status(400).json(response)
				} else {
					Logger.info('Creating user: ' + JSON.stringify(user))
					const userObj = new User({
						firstname:   user.firstname,
						lastname:    user.lastname,
						email: 		   user.email,
						password:    user.password,
						sexCode:     user.sexCode,
						countryCode: user.countryCode,
						birthDate:   user.birthDate
					})

					User.createUser(userObj, (err) => {
						if ( err ) {
							throw err
							res.status(500).json({ status: ServerConfig.App.Status.REGISTRATION_FAILURE })
						} else {
							res.status(200).json({ status: ServerConfig.App.Status.REGISTRATION_SUCCESS })
						}
					})
				}
			}
		})
	} else {
		res.status(400).json(response)
	}
})

signInUserRouter.post(ServerConfig.URL.SEPERATOR, (req, res) => {
	const credentials = req.body

	Logger.info('Recieved credentials data: ' + JSON.stringify(credentials))

	let   response    = validateUser(credentials)

	if ( _.isEqual(response.status, ServerConfig.App.Status.VALIDATION_SUCCESS) ) {
		Logger.info('Authenticating user')

		User.getUserByEmail(credentials.email, function (err, user) {
			if ( err ) {
				throw err
				res.status(500).json({ status: ServerConfig.App.Status.SIGNIN_FAILURE })
			} else {
				if ( !user ) {
					Logger.info('User does not exists')
					response.status       = ServerConfig.App.Status.SIGNIN_FAILURE
					response.errors.email = ServerConfig.App.Error.USER_DOES_NOT_EXISTS
					res.status(400).json(response)
				} else {
					User.matchPassword(credentials.password, user.password, function (err, match) {
						if ( err ) {
							throw err
						} else {
							if ( match ) {
								Logger.info('Password matches')
								const token = createUserToken(user)
								Logger.info('Created token for authentication: ' + JSON.stringify(token))

								res.status(200).json({
									status: ServerConfig.App.Status.SIGNIN_SUCCESS,
									 token: token
								})
							} else {
								Logger.info('Password does not match')
								response.status          = ServerConfig.App.Status.SIGNIN_FAILURE
								response.errors.password = ServerConfig.App.Error.PASSWORD_DOES_NOT_MATCH
								res.status(400).json(response)
							}
						}
					})
				}
			}
		})
	}  else {
		res.status(400).json(response)
	}
})

export { signUpUserRouter, signInUserRouter }
