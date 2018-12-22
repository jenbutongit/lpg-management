import {Request, Response, Router} from 'express'

export class ReportingController {
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
			response.render('page/reporting')
		}
	}

	getLearnerRecordReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/learner-record')
		}
	}

	getRatingsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/ratings')
		}
	}

	getClassroomReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/classroom')
		}
	}

	getProfessionsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/professions')
		}
	}
}
