import {IsNotEmpty, IsPositive} from 'class-validator'

export class Venue {
	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.location.empty',
	})
	location: string

	address: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.capacity.empty',
	})
	@IsPositive({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.capacity.positive',
	})
	capacity: number

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.minCapacity.empty',
	})
	@IsPositive({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.minCapacity.positive',
	})
	minCapacity: number

	availability: number
}
