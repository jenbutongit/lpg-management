import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {EventRecord} from '../../../../src/leaner-record/model/EventRecord'
import {beforeEach} from 'mocha'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Event Record Tests', () => {
	let eventRecord: EventRecord

	beforeEach(() => {
		eventRecord = new EventRecord()
	})

	it('should be able to set courseId', () => {
		eventRecord.courseId = 'courseId'
		expect(eventRecord.courseId).to.equal('courseId')
	})

	it('should be able to set moduleId', () => {
		eventRecord.moduleId = 'moduleId'
		expect(eventRecord.moduleId).to.equal('moduleId')
	})

	it('should be able to set eventId', () => {
		eventRecord.eventId = 'eventId'
		expect(eventRecord.eventId).to.equal('eventId')
	})

	it('should be able to set bookingReference', () => {
		eventRecord.bookingReference = 'bookingReference'
		expect(eventRecord.bookingReference).to.equal('bookingReference')
	})

	it('should be able to set status', () => {
		eventRecord.status = EventRecord.Status.APPROVED
		expect(eventRecord.status).to.equal(EventRecord.Status.APPROVED)
	})

	it('should be able to set paymentMethod', () => {
		eventRecord.paymentMethod = 'paymentMethod'
		expect(eventRecord.paymentMethod).to.equal('paymentMethod')
	})

	it('should be able to set paymentDetails', () => {
		eventRecord.paymentDetails = 'paymentDetails'
		expect(eventRecord.paymentDetails).to.equal('paymentDetails')
	})

	it('should be able to set learnerEmail address', () => {
		eventRecord.delegateEmailAddress = 'test@test.com'
		expect(eventRecord.delegateEmailAddress).to.equal('test@test.com')
	})
})
