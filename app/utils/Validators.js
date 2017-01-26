import validator from 'validator'
import moment from 'moment'
import _ from 'lodash'

import BaseConfig from './../config/BaseConfig'
import Countries from './../data/Countries'
import Sex from './../data/Sex'

const validateUser = (user) => {
	let   response     = { status: null, errors: { } }
	const sexCodes     = Sex.map(({code}) => code)
	const countryCodes = Countries.map(({cca2}) => cca2)

	if ( user.firstname !== undefined ) {
		if ( validator.isEmpty(user.firstname) ) {
			response.errors.firstname       = BaseConfig.App.Error.FIELD_REQUIRED
		}
	}

	if ( user.lastname !== undefined ) {
		if ( validator.isEmpty(user.lastname) ) {
			response.errors.lastname        = BaseConfig.App.Error.FIELD_REQUIRED
		}
	}

	if ( user.email !== undefined ) {
		if ( validator.isEmpty(user.email) ) {
			response.errors.email           = BaseConfig.App.Error.FIELD_REQUIRED
		} else if ( !validator.isEmail(user.email) ) {
			response.errors.email           = BaseConfig.App.Error.INVALID_EMAIL_ADDRESS
		}
	}

	if ( user.password !== undefined ) {
		if ( validator.isEmpty(user.password) ) {
			response.errors.password        = BaseConfig.App.Error.FIELD_REQUIRED
		}
	}

	if ( user.confirmPassword !== undefined ) {
		if ( validator.isEmpty(user.confirmPassword) ) {
			response.errors.confirmPassword = BaseConfig.App.Error.FIELD_REQUIRED
		} else if ( !validator.equals(user.password, user.confirmPassword) ) {
			response.errors.confirmPassword = BaseConfig.App.Error.PASSWORD_DOES_NOT_MATCH
		}
	}

	if ( user.birthDate !== undefined ) {
		if ( validator.isEmpty(user.birthDate) ) {
			response.errors.birthDate       = BaseConfig.App.Error.FIELD_REQUIRED
		} else if ( !moment(user.birthDate, BaseConfig.App.BIRTHDATE_FORMAT).isValid() ) {
			response.errors.birthDate       = BaseConfig.App.Error.INVALID_DATE_FORMAT
		}
	}

	if ( user.sexCode !== undefined ) {
		if ( validator.isEmpty(user.sexCode) ) {
			response.errors.sexCode         = BaseConfig.App.Error.FIELD_REQUIRED
		} else if ( !validator.isIn(user.sexCode, sexCodes) ) {
			response.errors.sexCode         = BaseConfig.App.Error.INVALID_GENDER
		}
	}

	if ( user.countryCode !== undefined ) {
		if ( validator.isEmpty(user.countryCode) ) {
			response.errors.countryCode     = BaseConfig.App.Error.FIELD_REQUIRED
		} else if ( !validator.isIn(user.countryCode, countryCodes) ) {
			response.errors.countryCode     = BaseConfig.App.Error.INVALID_COUNTRY_CODE
		}
	}

	if ( _.isEmpty(response.errors) ) {
		response.status = BaseConfig.App.Status.VALIDATION_SUCCESS
	} else {
		response.status = BaseConfig.App.Status.VALIDATION_ERROR
	}

	return response
}

export { validateUser }
