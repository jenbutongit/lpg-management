import {ReportServiceConfig} from './reportServiceConfig'
import {OauthRestService} from '../lib/http/oauthRestService'
import {DateStartEnd} from '../learning-catalogue/model/dateStartEnd'

export class ReportService {
	config: ReportServiceConfig
	http: OauthRestService

	constructor(config: ReportServiceConfig, http: OauthRestService) {
		this.config = config
		this.http = http
	}

	getReportBookingInformation(dateRange: DateStartEnd) {
		const reportUrl = `${this.config.url}/bookings?from=${dateRange.startDate}&to=${dateRange.endDate}`

		return this.http.get(reportUrl)
	}

	getReportLearnerRecord(dateRange: DateStartEnd) {
		const reportUrl = `${this.config.url}/modules?from=${dateRange.startDate}&to=${dateRange.endDate}`

		return this.http.get(reportUrl)
	}

	getReportForSuperAdmin(startDate: any, endDate: any, professionID: any) {
		let reportUrl
		if (professionID == "") {
			reportUrl = `http://localhost:9002/report/skills/report-for-super-admin?from=${startDate}&to=${endDate}`
		} else {
			reportUrl = `http://localhost:9002/report/skills/report-for-super-admin?from=${startDate}&to=${endDate}&professionId=${professionID}`
		}

		return this.http.get(reportUrl)
	}

	getReportForOrgAdmin(startDate: any, endDate: any, professionID: any) {
		let reportUrl
		if (professionID == "") {
			reportUrl = `http://localhost:9002/report-for-department-admin?from=${startDate}&to=${endDate}`
		} else {
			reportUrl = `http://localhost:9002/report-for-department-admin?from=${startDate}&to=${endDate}&professionId=${professionID}`
		}

		return this.http.get(reportUrl)
	}

	getReportForProfAdmin(startDate: any, endDate: any) {

		const reportUrl = `http://localhost:9002/report-for-department-admin?from=${startDate}&to=${endDate}`

		return this.http.get(reportUrl)
	}

}
