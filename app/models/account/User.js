import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import moment from 'moment'

import ServerConfig from './../../config/ServerConfig'

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
})

const User         = mongoose.model('User', UserSchema)

User.createUser    = (user, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			user.password          = hash
			user.birthDate         = moment(user.birthDate).toDate()
			user.registerTimeStamp = moment().utc().format()
			user.save(callback)
		})
	})
}

User.getUserByEmail  = (email, callback) => {
	const query        = { email: email }
	User.findOne(query, callback)
}

User.getUserByID     = (id, callback) => {
	User.findById(id, callback)
}


User.matchPassword   = (password, passwordHash, callback) => {
	bcrypt.compare(password, passwordHash, (err, res) => {
		if ( err ) {
			throw err
		} else {
			callback(null, res)
		}
	})
}

export default User