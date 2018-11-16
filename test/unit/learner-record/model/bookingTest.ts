import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {Booking} from '../../../../src/learner-record/model/booking'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Booking Test', () => {
	let booking: Booking

	beforeEach(() => {
		booking = new Booking()
	})

	it('should be able to set id', () => {
		booking.id = 99
		expect(booking.id).to.equal(99)
	})

	it('should be able to se booking time', () => {
		const date: Date = new Date(100000)

		booking.bookingTime = date
		expect(booking.bookingTime).to.equal(date)
	})

	it('should be able to set learner', () => {
		booking.learner = 'test-learner'
		expect(booking.learner).to.equal('test-learner')
	})

	it('should be able to set learner email', () => {
		booking.learnerEmail = 'test@domain.com'
		expect(booking.learnerEmail).to.equal('test@domain.com')
	})

	it('should be able to set event', () => {
		booking.event = 'test-event'
		expect(booking.event).to.equal('test-event')
	})

	it('should be able to set payment details', () => {
		booking.paymentDetails = '/test/payment/details'
		expect(booking.paymentDetails).to.equal('/test/payment/details')
	})

	it('should be able to set status', () => {
		booking.status = Booking.Status.CONFIRMED
		expect(booking.status).to.equal(Booking.Status.CONFIRMED)
	})
})
