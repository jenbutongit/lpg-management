export class Booking {
	id: number
	learner: string
	learnerEmail: string
	event: string
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
