import {NextFunction, Request, Response, Router} from 'express'
import {ReportService} from '../report-service'

export class ReportingController {
	router: Router
	exampleYear: number
	exampleMonth: number
	exampleDay: number
	reportService: ReportService

	constructor(reportService: ReportService) {
		this.router = Router()
		this.configureRouterPaths()
		this.exampleYear = new Date().getFullYear()
		this.exampleMonth = new Date().getMonth() + 1
		this.exampleDay = new Date().getDate()
		this.reportService = reportService
	}

	private configureRouterPaths() {
		this.router.get('/reporting', this.getReports())
		this.router.get('/reporting/learner-record', this.getLearnerRecordReport())
		this.router.get('/reporting/ratings', this.getRatingsReport())
		this.router.get('/reporting/classroom', this.getClassroomReport())
		this.router.get('/reporting/professions', this.getProfessionsReport())
		this.router.get('/reporting/booking-information', this.generateReport())
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
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Learner record'})
		}
	}

	getRatingsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Course ratings'})
		}
	}

	getClassroomReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Course performance'})
		}
	}

	getProfessionsReport() {
		return async (request: Request, response: Response) => {
			response.render('page/reporting/report', {exampleDate: this.currentDate(), pageTitle: 'Learners by profession'})
		}
	}

	generateReport() {
		return async (request: Request, response: Response, next: NextFunction) => {
			try {
				await this.reportService
					.getReport(request.query)
					.then(report => {
						response.writeHead(200, {
							'Content-type': 'text/csv',
							'Content-disposition': `attachment;filename=${request.query['report-type']}.csv`,
							'Content-length': report.length,
						})
						response.end(Buffer.from(report, 'binary'))
					})
					.catch(error => {
						next(error)
					})
			} catch (error) {
				throw new Error(error)
			}
		}
	}
}