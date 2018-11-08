import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {Invite} from '../../../../src/learner-record/model/invite'
import {expect} from 'chai'
import {LearnerRecordEvent} from '../../../../src/learner-record/model/learnerRecordEvent'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Invite tests', () => {
	let invite: Invite

	beforeEach(() => {
		invite = new Invite()
	})

	it('should be able to set id', () => {
		invite.id = 1
		expect(invite.id).to.equal(1)
	})

	it('should be able to set event', () => {
		let event: LearnerRecordEvent = new LearnerRecordEvent()
		event.path = 'test/path'
		event.eventUid = 'test-event-uid'
		event.id = 1

		invite.event = event
		expect(invite.event).to.equal(event)
	})

	it('should be able to set learnerEmail', () => {
		invite.learnerEmail = 'test@test.com'
		expect(invite.learnerEmail).to.equal('test@test.com')
	})
})
