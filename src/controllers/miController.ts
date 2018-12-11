import {Request, Response, Router} from 'express'

export class MiController {
	router: Router

	constructor() {
		this.router = Router()
		this.configureRouterPaths()
	}

	private configureRouterPaths() {
		this.router.get('/reports', this.getReports())
		this.router.get('/reports/learner-record', this.getLearnerRecordReport())
		this.router.get('/reports/ratings', this.getRatingsReport())
		this.router.get('/reports/classroom', this.getClassroomReport())
		this.router.get('/reports/professions', this.getProfessionsReport())
	}

	getReports() {
		return async (request: Request, response: Response) => {
			response.render('page/mi')
		}
	}

	getLearnerRecordReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reports/learner-record')
		}
	}

	getRatingsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reports/ratings')
		}
	}

	getClassroomReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reports/classroom')
		}
	}

	getProfessionsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reports/professions')
		}
	}
}
