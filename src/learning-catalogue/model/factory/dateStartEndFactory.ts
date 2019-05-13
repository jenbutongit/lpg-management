import {Factory} from './factory'
import {DateStartEnd} from '../dateStartEnd'

export class DateStartEndFactory implements Factory<DateStartEnd> {
	create(data: any) {
		let dateRange = new DateStartEnd()

		dateRange.startDate = data.startDate
		dateRange.endDate = data.endDate

		return dateRange
	}
}
