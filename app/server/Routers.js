import express from 'express'
import _ from 'lodash'
import passport from 'passport'

import ServerConfig from './../config/ServerConfig'
import { validateUser } from './../utils/Validators'
import User from './../models/account/User'
import Logger from './../utils/Logger'

const registerUserRouter = express.Router()
const loginUserRouter    = express.Router()

registerUserRouter.post(ServerConfig.URL.SEPERATOR, (req, res) => {
	const user      = req.body

	Logger.info('Recieved user registration data: ' + JSON.stringify(user))

	let   response  = validateUser(user)

	if ( _.isEqual(response.status, ServerConfig.App.Status.VALIDATION_SUCCESS) ) {
		User.getUserByEmail(user, (err, user) => {
			if ( err ) {
				throw err
				res.status(500).json({ status: ServerConfig.App.Status.REGISTRATION_FAILURE })
			} else {
				if ( user ) {
					response.status       = ServerConfig.App.Status.VALIDATION_ERROR
					response.errors.email = ServerConfig.App.Error.EMAIL_ADDRESS_EXISTS
					res.status(400).json(response)
				} else {
					const userObj = new User({
						firstname:   user.firstname,
						lastname:    user.lastname,
						email: 		   user.email,
						password:    user.password,
						sexCode:     user.sexCode,
						countryCode: user.countryCode,
						birthDate:   user.birthDate,
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

loginUserRouter.post(ServerConfig.URL.SEPERATOR, passport.authenticate('local', {
	sucessRedirect: ServerConfig.URL.BASE,
	failureRedirect: ServerConfig.URL.SIGNIN
}))

export { registerUserRouter, loginUserRouter }
