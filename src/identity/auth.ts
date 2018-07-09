import * as express from "express"

export class Auth {

	constructor(clientID: string,
				clientSecret: string,
				authenticationServiceUrl: string,
				callbackUrl: string) {
	}

	authenticate() {
		return (req: express.Request, res: express.Response, next: express.NextFunction) => {
			if (req.isAuthenticated()) {
				return next()
			}
			const session = req.session!
			session.redirectTo = req.originalUrl
			session.save(() => {
				res.redirect('/authenticate')
			})
		}
	}
}