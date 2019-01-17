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
		this.exampleMonth = new Date().getMonth() + 1
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
			response.render('page/reporting/index')
		}
	}

	getLearnerRecordReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Learner data'})
		}
	}

	getRatingsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Registered learners'})
		}
	}

	getClassroomReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Booking information'})
		}
	}

	getProfessionsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Learners by profession'})
		}
	}
}
