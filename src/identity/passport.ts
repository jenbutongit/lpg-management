import * as express from 'express'
import * as identityservice from './identity-service'
import * as identity from './identity'
import * as log4js from 'log4js'
import * as passport from 'passport'
import * as oauth2 from 'passport-oauth2'

const logger = log4js.getLogger('config/passport')

let strategy: oauth2.Strategy

export function configure(
	clientID: string,
	clientSecret: string,
	authenticationServiceUrl: string,
	app: express.Express,
	callbackUrl: string
) {
	app.use(passport.initialize())
	app.use(passport.session())

	strategy = new oauth2.Strategy(
		{
			authorizationURL: `${authenticationServiceUrl}/oauth/authorize`,
			callbackURL: `${callbackUrl}/authenticate`,
			clientID,
			clientSecret,
			tokenURL: `${authenticationServiceUrl}/oauth/token`,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: any,
			cb: oauth2.VerifyCallback
		) => {
			profile.accessToken = accessToken

			try {
				const identityDetails = await identityservice.getDetails(accessToken)

				const combined = {
					...profile,
					...identityDetails,
				}
				const user = identity.Identity.create(combined)
				return cb(null, user)
			} catch (e) {
				logger.warn(`Error retrieving user profile information`, e)
				cb(e)
			}
		}
	)

	passport.use(strategy)

	passport.serializeUser((user, done) => {
		done(null, JSON.stringify(user))
	})

	passport.deserializeUser<identity.Identity, string>(async (data, done) => {
		done(null, identity.Identity.create(JSON.parse(data)))
	})

	app.all(
		'/authenticate',
		passport.authenticate('oauth2', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		(req: express.Request, res: express.Response) => {
			const session = req.session
			if (!session) {
				console.log('passport: session not present on express request')
				res.sendStatus(500)
				return
			}
			let {redirectTo} = session
			if (!redirectTo) {
				redirectTo = '/'
			}
			delete session.redirectTo
			session.save(() => {
				res.redirect(redirectTo)
			})
		}
	)
}

export function isAuthenticated(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) {
	if (req.isAuthenticated()) {
		return next()
	}
	const session = req.session!
	session.redirectTo = req.originalUrl
	session.save(() => {
		res.redirect('/authenticate')
	})
}

export function hasRole(role: string) {
	return (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (req.user && req.user.hasRole(role)) {
			return next()
		}
		res.sendStatus(401)
	}
}

export function hasAnyRole(roles: string[]) {
	return (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (req.user && req.user.hasAnyRole(roles)) {
			return next()
		}
		res.sendStatus(401)
	}
}

export function logout(
	authenticationServiceUrl: string,
	callbackUrl: string,
	req: express.Request,
	res: express.Response
) {
	req.logout()
	res.redirect(`${authenticationServiceUrl}/logout?returnTo=${callbackUrl}`)
}
