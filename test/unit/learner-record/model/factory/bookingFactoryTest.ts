import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {BookingFactory} from '../../../../../src/learner-record/model/factory/bookingFactory'
import {beforeEach} from 'mocha'
import {Booking} from '../../../../../src/learner-record/model/booking'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Booking factory test', () => {
	let bookingFactory: BookingFactory

	beforeEach(() => {
		bookingFactory = new BookingFactory()
	})

	it('should create booking from data', () => {
		const date: Date = new Date(10000)

		const data = {
			id: 99,
			bookingTime: date,
			learner: 'test/learner',
			learnerEmail: 'test@domain.com',
			event: 'test/event',
			paymentDetails: 'test/payment/details',
			status: Booking.Status.CONFIRMED,
		}

		const booking = bookingFactory.create(data)

		expect(booking.id).to.equal(99)
		expect(booking.bookingTime).to.equal(date)
		expect(booking.learner).to.equal('test/learner')
		expect(booking.learnerEmail).to.equal('test@domain.com')
		expect(booking.event).to.equal('test/event')
		expect(booking.paymentDetails).to.equal('test/payment/details')
		expect(booking.status).to.equal(Booking.Status.CONFIRMED)
	})
})
