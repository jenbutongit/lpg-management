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

	getReport(params: {
		'report-type': string,
		'from-year': number,
		'from-month': number,
		'from-day': number,
		'to-year': number,
		'to-month': number,
		'to-day': number,
	}) {

		const from = moment().utc()
			.date(params['from-day'])
			.month(params['from-month'] - 1)
			.year(params['from-year'])
			.format('YYYY-MM-DD')

		const to = moment().utc()
			.date(params['to-day'])
			.month(params['to-month'] - 1)
			.year(params['to-year'])
			.format('YYYY-MM-DD')

		const reportUrl = `${this.config.url}${this.config.map[params['report-type']]}?from=${from}&to=${to}`

		return this.http.get(reportUrl)
	}
}