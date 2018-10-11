import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {EventRecordFactory} from '../../../../../src/leaner-record/model/factory/eventRecordFactory'
import {beforeEach} from 'mocha'
import {EventRecord} from '../../../../../src/leaner-record/model/eventRecord'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Event Record Factory Tests', () => {
	let eventRecordFactory: EventRecordFactory

	beforeEach(() => {
		eventRecordFactory = new EventRecordFactory()
	})

	it('should created event record from data', () => {
		const bookingReference = 'bookingReference'
		const courseId = 'courseId'
		const delegateEmailAddress = 'test@test.com'
		const eventId = 'eventId'
		const moduleId = 'moduleId'
		const paymentDetails = 'paymentDetails'
		const paymentMethod = 'paymentMethod'
		const status = EventRecord.Status.APPROVED

		const data = {
			bookingReference: bookingReference,
			courseId: courseId,
			delegateEmailAddress: delegateEmailAddress,
			eventId: eventId,
			moduleId: moduleId,
			paymentDetails: paymentDetails,
			paymentMethod: paymentMethod,
			status: status,
		}

		const eventRecord = eventRecordFactory.create(data)

		expect(eventRecord.bookingReference).to.equal(bookingReference)
		expect(eventRecord.courseId).to.equal(courseId)
		expect(eventRecord.delegateEmailAddress).to.equal(delegateEmailAddress)
		expect(eventRecord.eventId).to.equal(eventId)
		expect(eventRecord.moduleId).to.equal(moduleId)
		expect(eventRecord.paymentDetails).to.equal(paymentDetails)
		expect(eventRecord.paymentMethod).to.equal(paymentMethod)
		expect(eventRecord.status).to.equal('APPROVED')
	})
})
