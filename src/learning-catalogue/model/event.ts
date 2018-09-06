import {IsNotEmpty} from 'class-validator'
import {DateRange} from './DateRange'
import {Venue} from "./venue";

export class Event {
	id: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.dateRanges'],
		message: 'validation_module_event_dateRanges_empty',
	})
	dateRanges: Array<DateRange> | undefined

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation_module_event_location_empty',
	})
	venue: Venue
}
