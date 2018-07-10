import {NextFunction, Request, Response, Handler} from 'express'
// import * as identityservice from './identity-service'
// import * as identity from './identity'
// import * as oauth2 from 'passport-oauth2'
// import * as log4js from "log4js"
import {PassportStatic} from 'passport'

// const logger = log4js.getLogger('config/passport')

export class Auth {
	clientId: string
	clientSecret: string
	authenticationServiceUrl: string
	callbackUrl: string
	passportStatic: PassportStatic

	constructor(
		clientId: string,
		clientSecret: string,
		authenticationServiceUrl: string,
		callbackUrl: string,
		passportStatic: PassportStatic
	) {
		this.clientId = clientId
		this.clientSecret = clientSecret
		this.authenticationServiceUrl = authenticationServiceUrl
		this.callbackUrl = callbackUrl
		this.passportStatic = passportStatic
	}

	initialize(): Handler {
		return this.passportStatic.initialize()
	}

	session(): Handler {
		return this.passportStatic.session()
	}

	authenticate() {
		return (req: Request, res: Response, next: NextFunction) => {
			if (req.isAuthenticated()) {
				return next()
			}

			res.cookie('redirectTo', req.originalUrl)
			res.redirect('/authenticate')
		}
	}

	// configureStrategy() {
	// 	let strategy: oauth2.Strategy
	// 	strategy = new oauth2.Strategy(
	// 		{
	// 			authorizationURL: `${this.authenticationServiceUrl}/oauth/authorize`,
	// 			callbackURL: `${this.callbackUrl}/authenticate`,
	// 			clientID: this.clientId,
	// 			clientSecret: this.clientSecret,
	// 			tokenURL: `${this.authenticationServiceUrl}/oauth/token`,
	// 		},
	// 		async (
	// 			accessToken: string,
	// 			refreshToken: string,
	// 			profile: any,
	// 			cb: oauth2.VerifyCallback
	// 		) => {
	// 			profile.accessToken = accessToken
	//
	// 			try {
	// 				const identityDetails = await identityservice.getDetails(accessToken)
	//
	// 				const combined = {
	// 					...profile,
	// 					...identityDetails,
	// 				}
	// 				const user = identity.Identity.create(combined)
	// 				return cb(null, user)
	// 			} catch (e) {
	// 				logger.warn(`Error retrieving user profile information`, e)
	// 				cb(e)
	// 			}
	// 		}
	// 	)
	// }
}
