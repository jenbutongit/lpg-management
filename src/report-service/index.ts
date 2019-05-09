import {ReportServiceConfig} from './reportServiceConfig'
import moment = require('moment')
import {OauthRestService} from '../lib/http/oauthRestService'

export class ReportService {
	config: ReportServiceConfig
	http: OauthRestService

	constructor(config: ReportServiceConfig, http: OauthRestService) {
		this.config = config
		this.http = http
	}

	getReportBookingInformation(date: any) {
		const from = moment()
			.utc()
			.date(date.startDay)
			.month(date.startMonth - 1)
			.year(date.startYear)
			.format('YYYY-MM-DD')

		const to = moment()
			.utc()
			.date(date.endDay)
			.month(date.endMonth - 1)
			.year(date.endYear)
			.format('YYYY-MM-DD')

		const reportUrl = `${this.config.url}/bookings?from=${from}&to=${to}`

		return this.http.get(reportUrl)
	}

	getReportLearnerRecord(date: any) {
		const from = moment()
			.utc()
			.date(date.startDay)
			.month(date.startMonth)
			.year(date.startYear)
			.format('YYYY-MM-DD')

		const to = moment()
			.utc()
			.date(date.endDay)
			.month(date.endMonth)
			.year(date.endYear)
			.format('YYYY-MM-DD')

		const reportUrl = `${this.config.url}/modules?from=${from}&to=${to}`

		return this.http.get(reportUrl)
	}
}
