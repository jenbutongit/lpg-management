import {Request, Response, Router} from 'express'

export class ReportingController {
	router: Router
	exampleYear: number
	exampleMonth: number
	exampleDay: number

	constructor() {
		this.router = Router()
		this.configureRouterPaths()
		this.exampleYear = new Date().getFullYear()
		this.exampleMonth = new Date().getMonth()
		this.exampleDay = new Date().getDate()
	}

	private configureRouterPaths() {
		this.router.get('/reporting', this.getReports())
		this.router.get('/reporting/learner-record', this.getLearnerRecordReport())
		this.router.get('/reporting/ratings', this.getRatingsReport())
		this.router.get('/reporting/classroom', this.getClassroomReport())
		this.router.get('/reporting/professions', this.getProfessionsReport())
	}

	currentDate() {
		return this.exampleDay + ' ' + this.exampleMonth + ' ' + this.exampleYear
	}

	getReports() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting')
		}
	}

	getLearnerRecordReport() {
		console.log(this.exampleYear)
		return async (request: Request, response: Response) => {
			response.render('page/reporting/learner-record', this.currentDate())
		}
	}

	getRatingsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/ratings', {exampleYear: new Date(Date.now()).getFullYear() + 1})
		}
	}

	getClassroomReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/classroom', {exampleYear: new Date(Date.now()).getFullYear() + 1})
		}
	}

	getProfessionsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/professions', {exampleYear: new Date(Date.now()).getFullYear() + 1})
		}
	}
}
