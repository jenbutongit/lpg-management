import {DateTime} from 'lib/datetime'
import {Learner} from './Learner'
import {Event} from './Event'

export class Booking {
	id: number
	learner: Learner
	event: Event
	paymentDetails: string
	status: Booking.Status
	bookingTime: DateTime
}

export namespace Booking {
	export enum Status {
		REQUESTED,
		CONFIRMED,
	}
}
