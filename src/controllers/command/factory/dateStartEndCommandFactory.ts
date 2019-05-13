import {DateStartEndCommand} from '../dateStartEndCommand'

export class DateStartEndCommandFactory {
	create(data: any) {
		let dateStartEndCommand = new DateStartEndCommand()
		dateStartEndCommand.startDay = data.startDay
		dateStartEndCommand.startMonth = data.startMonth
		dateStartEndCommand.startYear = data.startYear
		dateStartEndCommand.endDay = data.endDay
		dateStartEndCommand.endMonth = data.endMonth
		dateStartEndCommand.endYear = data.endYear

		return dateStartEndCommand
	}
}
