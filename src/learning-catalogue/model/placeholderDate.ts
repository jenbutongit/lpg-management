import moment = require('moment')

export class PlaceholderDate {
	endDate: moment.Moment
	startDate: moment.Moment
	constructor() {
		this.endDate = moment()
		this.startDate = moment()
	}
}
