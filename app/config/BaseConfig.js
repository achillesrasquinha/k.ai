import path from 'path'

class BaseConfig { }

BaseConfig.Path                 = { }
BaseConfig.Path.ROOT            = path.resolve(__dirname, './../')
BaseConfig.Path.VIEWS           = path.join(BaseConfig.Path.ROOT, 'views')

BaseConfig.URL                  = { }
BaseConfig.URL.BASE             = '/'
BaseConfig.URL.SIGNIN           = path.join(BaseConfig.URL.BASE, 'SignIn')
BaseConfig.URL.SIGNUP           = path.join(BaseConfig.URL.BASE, 'SignUp')
BaseConfig.URL.SEPERATOR        = '/'
BaseConfig.URL.API              = {
	'signup_user':     path.join(BaseConfig.URL.BASE, 'api', 'SignUpUser'),
	'signin_user':     path.join(BaseConfig.URL.BASE, 'api', 'SignInUser'),
	'message_history': path.join(BaseConfig.URL.BASE, 'api', 'GetMessages')
}

BaseConfig.URI                  = { }

BaseConfig.App                  = { }
BaseConfig.App.NAME             = 'k.ai'
BaseConfig.App.TITLE            = {
  index: 'An assistant just for you'
}
BaseConfig.App.BIRTHDATE_FORMAT = 'MMMM Do, YYYY'


BaseConfig.App.Status           = {
	VALIDATION_SUCCESS:      { message: 'Successful validation' },
	VALIDATION_ERROR:        { message: 'Error during validation' },
	REGISTRATION_SUCCESS:    { message: 'Successfully registered' },
	REGISTRATION_FAILURE:    { message: 'Unsucessful registration' },
	INTERNAL_SERVER_ERROR:   { message: 'Internal Server Error' },
	SIGNIN_SUCESS:           { message: 'Sucessfully signed in' },
	SIGNIN_FAILURE:          { message: 'Unsucessful sign in' }
}

BaseConfig.App.Error            = {
	FIELD_REQUIRED:          { message: 'This field is required' },
	INVALID_EMAIL_ADDRESS:   { message: 'Invalid email address' },
	PASSWORD_DOES_NOT_MATCH: { message: 'Password does not match' },
	INVALID_GENDER:          { message: 'Invalid gender' },
	INVALID_DATE_FORMAT:     { message: 'Invalid date format' },
	INVALID_COUNTRY_CODE:    { message: 'Invalid country code' },
	EMAIL_ADDRESS_EXISTS:    { message: 'Email address already exists' },
	USER_DOES_NOT_EXISTS:    { message: 'User does not exists' }
}

export default BaseConfig
