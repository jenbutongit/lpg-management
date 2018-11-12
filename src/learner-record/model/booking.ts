export class Booking {
	id: number
	bookingTime: Date
	learner: string
	learnerEmail: string
	event: string
	paymentDetails: string
	status: Booking.Status
}

export namespace Booking {
	export enum Status {
		REQUESTED = 'Requested',
		CONFIRMED = 'Confirmed',
	}
}
