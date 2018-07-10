import {NextFunction, Request, Response, Handler} from 'express'
import * as log4js from 'log4js'
import {PassportStatic} from 'passport'
import {IdentityService} from './identityService'
import * as oauth2 from 'passport-oauth2'

const logger = log4js.getLogger('config/passport')

export class Auth {
	clientId: string
	clientSecret: string
	authenticationServiceUrl: string
	callbackUrl: string
	passportStatic: PassportStatic
	identityService: IdentityService

	constructor(
		clientId: string,
		clientSecret: string,
		authenticationServiceUrl: string,
		callbackUrl: string,
		passportStatic: PassportStatic,
		identityService: IdentityService
	) {
		this.clientId = clientId
		this.clientSecret = clientSecret
		this.authenticationServiceUrl = authenticationServiceUrl
		this.callbackUrl = callbackUrl
		this.passportStatic = passportStatic
		this.identityService = identityService
	}

	initialize(): Handler {
		return this.passportStatic.initialize()
	}

	session(): Handler {
		return this.passportStatic.session()
	}

	configureStrategy() {
		let strategy: oauth2.Strategy
		strategy = new oauth2.Strategy(
			{
				authorizationURL: `${this.authenticationServiceUrl}/oauth/authorize`,
				callbackURL: `${this.callbackUrl}/authenticate`,
				clientID: this.clientId,
				clientSecret: this.clientSecret,
				tokenURL: `${this.authenticationServiceUrl}/oauth/token`,
			},
			this.verify()
		)
		this.useStrategy(strategy)
	}

	verify() {
		return async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: oauth2.VerifyCallback
		) => {
			try {
				const identityDetails = await this.identityService.getDetails(
					accessToken
				)

				cb(null, identityDetails)
			} catch (e) {
				logger.warn(`Error retrieving user profile information`, e)
				cb(e)
			}
		}
	}

	useStrategy(strategy: oauth2.Strategy) {
		this.passportStatic.use(strategy)
	}

	serializeUser(identityDetails: any) {
		return this.passportStatic.serializeUser(identityDetails)
	}

	deserializeUser(identityDetails: any) {
		return this.passportStatic.deserializeUser(identityDetails)
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
}
