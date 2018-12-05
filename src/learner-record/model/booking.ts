import {IsNotEmpty} from 'class-validator'

export class Booking {
	id: number
	bookingTime: Date
	learner: string
	learnerEmail: string
	event: string
	paymentDetails: string
	status: Booking.Status

	@IsNotEmpty({
		groups: ['reason'],
		message: 'attendee.validation.cancellationReason.empty',
	})
	cancellationReason: string
}

export namespace Booking {
	export enum Status {
		REQUESTED = 'Requested',
		CONFIRMED = 'Confirmed',
		CANCELLED = 'Cancelled',
	}
}
