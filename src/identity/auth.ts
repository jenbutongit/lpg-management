import {NextFunction, Request, Response} from "express";

export class Auth {

	constructor(clientID: string,
				clientSecret: string,
				authenticationServiceUrl: string,
				callbackUrl: string) {
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