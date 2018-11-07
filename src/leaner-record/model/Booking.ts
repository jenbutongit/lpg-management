import {Learner} from './Learner'
import {Event} from './Event'

export class Booking {
	id: number
	learner: Learner
	event: Event
	paymentDetails: string
	status: Booking.Status
	bookingTime: Date
}

export namespace Booking {
	export enum Status {
		REQUESTED,
		CONFIRMED,
	}
}
