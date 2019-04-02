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

	getReportBookingInformation(params: {'report-type': string; 'from-year': number; 'from-month': number; 'from-day': number; 'to-year': number; 'to-month': number; 'to-day': number}) {
		// hard-coding from and to until we can tie in with front end
		const from = moment()
			.utc()
			.date(1)
			.month(1)
			.year(2018)
			.format('YYYY-MM-DD')

		const to = moment()
			.utc()
			.date(1)
			.month(1)
			.year(2020)
			.format('YYYY-MM-DD')

		const reportUrl = `${this.config.url}/bookings?from=${from}&to=${to}`

		return this.http.get(reportUrl)
	}

    getReportLearnerRecord(params: {'report-type': string; 'from-year': number; 'from-month': number; 'from-day': number; 'to-year': number; 'to-month': number; 'to-day': number}) {
        // hard-coding from and to until we can tie in with front end
        const from = moment()
            .utc()
            .date(1)
            .month(1)
            .year(2018)
            .format('YYYY-MM-DD')

        const to = moment()
            .utc()
            .date(1)
            .month(1)
            .year(2020)
            .format('YYYY-MM-DD')

        const reportUrl = `${this.config.url}/modules?from=${from}&to=${to}`

        return this.http.get(reportUrl)
    }
}
