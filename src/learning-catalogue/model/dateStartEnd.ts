import {IsValidDateString} from '../validator/custom/isValidDateString'

export class DateStartEnd {
	@IsValidDateString({
		groups: ['all', 'event.all', 'event.dateRanges.date'],
		message: 'validation_report_start_invalid',
	})
	startDate: string

	@IsValidDateString({
		groups: ['all', 'event.all', 'event.dateRanges.date'],
		message: 'validation_report_end_invalid',
	})
	endDate: string
}
