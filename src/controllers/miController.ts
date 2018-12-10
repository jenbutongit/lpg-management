import {Request, Response, Router} from 'express'

export class MiController {
	router: Router

	constructor() {
		this.router = Router()
		this.configureRouterPaths()
	}

	private configureRouterPaths() {
		this.router.get('/reporting', this.getReports())
	}

	getReports() {
		return async (request: Request, response: Response) => {
			response.render('page/mi')
		}
	}
}
