import {Request, Response, Router} from 'express'

export class MiController {
	router: Router

	constructor() {
		this.router = Router()
		this.configureRouterPaths()
	}

	private configureRouterPaths() {
		this.router.get('/reporting', this.getReports())
		this.router.get('/reporting/learner-record', this.getLearnerRecordReport())
		this.router.get('/reporting/ratings', this.getRatingsReport())
		this.router.get('/reporting/classroom', this.getClassroomReport())
		this.router.get('/reporting/professions', this.getProfessionsReport())
	}

	getReports() {
		return async (request: Request, response: Response) => {
			response.render('page/mi')
		}
	}

	getLearnerRecordReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reports/')
		}
	}

	getRatingsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/mi')
		}
	}

	getClassroomReport() {
		return async (request: Request, response: Response) => {
			response.render('page/mi')
		}
	}

	getProfessionsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/mi')
		}
	}
}
