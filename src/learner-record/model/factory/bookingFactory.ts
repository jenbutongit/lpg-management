import {Booking} from '../booking'

export class BookingFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any) {
		let booking: Booking = new Booking()

		booking.id = data.id
		booking.bookingTime = data.bookingTime
		booking.learner = data.learner
		booking.learnerEmail = data.learnerEmail
		booking.event = data.event
		booking.paymentDetails = data.paymentDetails
		booking.poNumber = data.poNumber
		booking.bookingReference = data.bookingReference
		booking.status = data.status ? Booking.Status[data.status.toUpperCase() as keyof typeof Booking.Status] : Booking.Status.REQUESTED
		booking.cancellationReason = data.cancellationReason

		return booking
	}
}
