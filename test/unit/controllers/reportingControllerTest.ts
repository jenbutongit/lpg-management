import {beforeEach, describe, it} from 'mocha'
import {ReportingController} from '../../../src/controllers/reportingController'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {expect} from 'chai'
import {Request, Response} from 'express'

chai.use(sinonChai)

describe('Reporting Controller Tests', function() {
	let reportingController: ReportingController

	beforeEach(() => {
		reportingController = new ReportingController()
	})

	it('should render reporting home page', async function() {
		const getReports: (req: Request, res: Response) => void = reportingController.getReports()

		const req: Request = mockReq()

		const res: Response = mockRes()

		await getReports(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/reporting/index')
	})

	it('should render learner record page', async function() {
		const getReports: (req: Request, res: Response) => void = reportingController.getLearnerRecordReport()

		const req: Request = mockReq()

		const res: Response = mockRes()

		await getReports(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/reporting/report')
	})

	it('should render course ratings page', async function() {
		const getReports: (req: Request, res: Response) => void = reportingController.getRatingsReport()

		const req: Request = mockReq()

		const res: Response = mockRes()

		await getReports(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/reporting/report')
	})

	it('should render course performance page', async function() {
		const getReports: (req: Request, res: Response) => void = reportingController.getClassroomReport()

		const req: Request = mockReq()

		const res: Response = mockRes()

		await getReports(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/reporting/report')
	})

	it('should render course professions  page', async function() {
		const getReports: (req: Request, res: Response) => void = reportingController.getProfessionsReport()

		const req: Request = mockReq()

		const res: Response = mockRes()

		await getReports(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/reporting/report')
	})
})
