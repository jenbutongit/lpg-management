import {IsNotEmpty, IsPositive} from "class-validator";

export class Venue {
	@IsNotEmpty({
		message: 'validation.module.event.venue.location.empty'
	})
	location: string

	address: string

	@IsNotEmpty({
		message: 'validation.module.event.venue.capacity.empty',
	})
	@IsPositive({
		message: 'validation.module.event.venue.capacity.positive',
	})
	capacity: number

	@IsNotEmpty({
		message: 'validation.module.event.venue.minCapacity.empty',
	})
	@IsPositive({
		message: 'validation.module.event.venue.minCapacity.positive',
	})
	minCapacity: number
}
