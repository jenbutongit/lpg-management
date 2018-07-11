import {NextFunction, Request, Response, Handler} from 'express'
import * as log4js from 'log4js'
import {PassportStatic} from 'passport'
import {IdentityService} from './identityService'
import * as oauth2 from 'passport-oauth2'
import {Identity} from './identity'

const logger = log4js.getLogger('config/passport')

export class Auth {
	public static get AUTHENTICATION_PATH(): string {
		return '/authenticate'
	}
	public static get REDIRECT_COOKIE_NAME(): string {
		return 'redirectTo'
	}

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

		this.passportStatic.serializeUser((user, done) => {
			done(null, JSON.stringify(user))
		})

		this.passportStatic.deserializeUser<Identity, string>(
			async (data, done) => {
				let jsonResponse = JSON.parse(data)
				done(
					null,
					new Identity(
						jsonResponse.uid,
						jsonResponse.roles,
						jsonResponse.accessToken
					)
				)
			}
		)
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

	checkAuthenticated() {
		return (req: Request, res: Response, next: NextFunction) => {
			if (req.isAuthenticated()) {
				return next()
			}

			res.cookie(Auth.REDIRECT_COOKIE_NAME, req.originalUrl)
			res.redirect(Auth.AUTHENTICATION_PATH)
		}
	}

	authenticate() {
		return this.passportStatic.authenticate('oauth2', {
			failureFlash: true,
			failureRedirect: '/',
		})
	}

	redirect() {
		return (req: Request, res: Response) => {
			const redirect = req.cookies[Auth.REDIRECT_COOKIE_NAME]
			if (!redirect) {
				logger.info('passport: session not present on express request')
				res.sendStatus(500)
				return
			}
			delete req.cookies[Auth.REDIRECT_COOKIE_NAME]
			res.redirect(redirect)
		}
	}
}
