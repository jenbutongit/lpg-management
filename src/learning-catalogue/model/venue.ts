import {IsNotEmpty, IsPositive} from "class-validator";

export class Venue {
	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation.module.event.venue.location.empty',
	})
	location: string

	address: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation.module.event.venue.capacity.empty',
	})
	@IsPositive({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation.module.event.venue.capacity.positive',
	})
	capacity: number

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation.module.event.venue.minCapacity.empty',
	})
	@IsPositive({
		groups: ['all', 'event.all', 'event.location'],
		message: 'validation.module.event.venue.minCapacity.positive',
	})
	minCapacity: number
}
