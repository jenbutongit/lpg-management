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
		booking.event = this.eventFactory.create(data.event)
		booking.paymentDetails = data.paymentDetails
		booking.learner = this.learnerFactory.create(data.learner)
		booking.status = Booking.Status[data.status as keyof typeof Booking.Status]

		return booking
	}
}
