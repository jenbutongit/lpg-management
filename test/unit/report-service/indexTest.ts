import {describe, it, beforeEach} from 'mocha'
import {ReportService} from '../../../src/report-service'
import {ReportServiceConfig} from '../../../src/report-service/reportServiceConfig'
import {expect} from 'chai'
import {OauthRestService} from '../../../src/lib/http/oauthRestService'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

describe('Report Service tests', () => {
	const config: ReportServiceConfig = new ReportServiceConfig('http://localhost', 15000, {
		booking: '/bookings',
	})

	let http: OauthRestService
	let reportService: ReportService

	beforeEach(() => {
		http = <OauthRestService>{}
		reportService = new ReportService(config, http)
	})

	it('should return the url of the report from form parameters', async () => {
		const query = {
			'report-type': 'booking',
			'from-year': 2018,
			'from-month': 3,
			'from-day': 1,
			'to-year': 2019,
			'to-month': 1,
			'to-day': 1,
		}

		http.get = sinon.stub()

		reportService.getReport(query)

		expect(http.get).to.have.been.calledOnceWith('http://localhost/bookings?from=2018-03-01&to=2019-01-01')
	})
})
