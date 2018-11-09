import {Booking} from '../Booking'
import {LearnerRecordEventFactory} from './EventFactory'
import {LearnerFactory} from './LearnerFactory'

export class BookingFactory {
	eventFactory: LearnerRecordEventFactory
	learnerFactory: LearnerFactory

	constructor(eventFactory: LearnerRecordEventFactory, learnerFactory: LearnerFactory) {
		this.eventFactory = eventFactory
		this.learnerFactory = learnerFactory

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
		booking.learner = data.learner
		booking.status = Booking.Status[data.status.toUpperCase() as keyof typeof Booking.Status]
		//booking.status = data.status

		return booking
	}
}
