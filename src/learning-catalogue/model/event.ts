import {IsNotEmpty, IsPositive, MinDate} from 'class-validator'

export class Event {
	id: string

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.startTimes'],
		message: 'validation.module.event.startTimes.empty',
	})
	@MinDate(new Date(Date.now()), {
		groups: ['all', 'event.all', 'event.startTimes'],
		message: 'validation.module.event.startTimes.past',
	})
	startTimes: Date[]

	@IsNotEmpty({
		groups: ['all', 'event.all', 'event.endTimes'],
		message: 'validation.module.event.endTimes.empty',
	})
	@MinDate(new Date(Date.now()), {
		groups: ['all', 'event.all', 'event.endTimes'],
		message: 'validation.module.event.endTimes.past',
	})
	endTimes: Date[]

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
