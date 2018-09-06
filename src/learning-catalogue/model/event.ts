import {IsNotEmpty, IsPositive} from 'class-validator'

export class Event {
	id: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.dateRanges'],
		message: 'validation.module.event.dateRanges.empty',
	})
	dateRanges: any

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation.module.event.location.empty',
	})
	location: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.capacity'],
		message: 'validation.module.event.capacity.empty',
	})
	@IsPositive({
		groups: ['all', 'event.all', 'event.capacity'],
		message: 'validation.module.event.capacity.positive',
	})
	capacity: number
}
