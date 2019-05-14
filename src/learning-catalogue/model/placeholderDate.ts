export class PlaceholderDate {
	startDay: string
	startMonth: string
	startYear: number
	endDay: string
	endMonth: string
	endYear: number
	constructor() {
		this.startDay = '01'
		this.startMonth = '04'
		this.startYear = new Date().getFullYear()
		this.endDay = '31'
		this.endMonth = '03'
		this.endYear = this.startYear + 1
	}
}
