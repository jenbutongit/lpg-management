export class PlaceholderDateSkills {
	startDay: string
	startMonth: string
	startYear: number
	endDay: string
	endMonth: string
	endYear: number
	constructor() {
		const today = new Date()
		this.startDay = '01'
		this.startMonth = '01'
		this.startYear = new Date().getFullYear()
		this.endDay = String(today.getDate()).padStart(2, '0')
		this.endMonth = String(today.getMonth() + 1).padStart(2, '0')
		this.endYear = today.getFullYear()
	}
}
