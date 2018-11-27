import {IsNotEmpty, IsPositive} from 'class-validator'

export class Venue {
	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.location.empty',
	})
	location: string

	address: string

	@IsPositive({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.capacity.positive',
	})
	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.capacity.empty',
	})
	capacity: number

	@IsPositive({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.minCapacity.positive',
	})
	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'venue.validation.minCapacity.empty',
	})
	minCapacity: number

	availability: number
}
