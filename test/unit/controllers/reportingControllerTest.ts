import {beforeEach, describe, it} from 'mocha'
import {ReportingController} from '../../../src/controllers/reportingController'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {expect} from 'chai'
import {NextFunction, Request, Response} from 'express'
import {ReportService} from '../../../src/report-service'
import * as sinon from 'sinon'

chai.use(sinonChai)

describe('Reporting Controller Tests', function() {
	let reportingController: ReportingController
	let reportService: ReportService
	let next: NextFunction

	beforeEach(() => {
		next = sinon.stub()
		reportService = <ReportService>{}
		reportingController = new ReportingController(reportService)
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

	it('should generate booking information report', async () => {
		const getReports: (req: Request, res: Response, next: NextFunction) => void = reportingController.generateReportBookingInformation()

		const req: Request = mockReq({
			query: {
				'report-type': 'booking-information',
				'from-year': '2018',
				'from-month': '1',
				'from-to': '1',
				'to-year': '2019',
				'to-month': '1',
				'to-day': '22',
			},
		})

		const data = 'a,b,c'

		reportService.getReportBookingInformation = sinon.stub().returns(Promise.resolve(data))

		const res: Response = mockRes()

		res.writeHead = sinon.stub()

		await getReports(req, res, next)

		const headers = {
			'Content-type': 'text/csv',
			'Content-disposition': 'attachment;filename=booking-information.csv',
			'Content-length': data.length,
		}

		expect(res.writeHead).to.have.been.calledOnceWith(200, headers)
		expect(res.end).to.have.been.calledOnceWith(Buffer.from(data, 'binary'))
	})

    it('should generate learner record report', async () => {
        const getReports: (req: Request, res: Response, next: NextFunction) => void = reportingController.generateReportLearnerRecord()

        const req: Request = mockReq({
            query: {
                'report-type': 'booking-information',
                'from-year': '2018',
                'from-month': '1',
                'from-to': '1',
                'to-year': '2019',
                'to-month': '1',
                'to-day': '22',
            },
        })

        const data = 'a,b,c'

        reportService.getReportLearnerRecord = sinon.stub().returns(Promise.resolve(data))

        const res: Response = mockRes()

        res.writeHead = sinon.stub()

        await getReports(req, res, next)

        const headers = {
            'Content-type': 'text/csv',
            'Content-disposition': 'attachment;filename=booking-information.csv',
            'Content-length': data.length,
        }

        expect(res.writeHead).to.have.been.calledOnceWith(200, headers)
        expect(res.end).to.have.been.calledOnceWith(Buffer.from(data, 'binary'))
    })
})
