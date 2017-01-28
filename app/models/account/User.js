import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import moment from 'moment'

import ServerConfig from './../../config/ServerConfig'
import Portfolio from './../../meta/stock/Portfolio'

import Logger from './../../utils/Logger'

mongoose.Promise  = global.Promise
mongoose.connect(ServerConfig.URI.MONGODB)

const db          = mongoose.connection

const UserSchema  = mongoose.Schema({
	firstname:         { type: String },
	lastname:          { type: String },
	email:             { type: String, unique: true },
	password:          { type: String },
	birthDate:         { type: Date },
	sexCode:           { type: Number },
	countryCode:       { type: String },
	registerTimeStamp: { type: String },
	portfolio:         mongoose.Schema.Types.Mixed
})

const User         = mongoose.model('User', UserSchema)

User.createUser    = (user, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			user.password          = hash
			user.birthDate         = moment(user.birthDate).toDate()
			user.registerTimeStamp = moment().utc().format(),
			user.portfolio         = new Portfolio()
			user.save(callback)
		})
	})
}

User.getUserByEmail   = (email, callback) => {
	const query         = { email: email }
	User.findOne(query, callback)
}

User.getUserByID      = (id, callback) => {
	User.findById(id, callback)
}

User.matchPassword    = (password, passwordHash, callback) => {
	bcrypt.compare(password, passwordHash, (err, res) => {
		if ( err ) {
			throw err
		} else {
			callback(null, res)
		}
	})
}

User.updatePortfolio  = (user, tradeOrder, callback) => {
	User.findOne({ _id: user._id }, (err, u) => {
		if ( err ) { throw err }

		if ( u ) {
			const portfolio = Portfolio.update(u.portfolio, tradeOrder)
			Logger.info('Recieved portfolio: ' + JSON.stringify(portfolio))

			u.portfolio = portfolio
			Logger.info('Assigned portfolio: ' + JSON.stringify(u.portfolio))

			u.save((err, updatedUser) => {
				Logger.info('Updated User: ' + JSON.stringify(updatedUser))
			})

			u.markModified('portfolio')
		}
	})
}

export default User
