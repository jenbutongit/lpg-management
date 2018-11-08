import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {expect} from 'chai'
import {InviteFactory} from '../../../../../src/learner-record/model/factory/inviteFactory'
import {LearnerRecordEventFactory} from '../../../../../src/learner-record/model/factory/learnerRecordEventFactory'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Invite factory tests', () => {
	let inviteFactory: InviteFactory
	let eventFactory: LearnerRecordEventFactory

	beforeEach(() => {
		eventFactory = new LearnerRecordEventFactory()
		inviteFactory = new InviteFactory(eventFactory)
	})

	it('should be create invite from data', () => {
		const eventData = {
			id: 1,
			eventUid: 'test-uid',
			path: 'test/path',
		}

		const data = {
			id: 'test-id',
			event: eventData,
			learnerEmail: 'test@email.com',
		}

		const invite = inviteFactory.create(data)

		expect(invite.id).to.equal('test-id')
		expect(invite.event.id).to.equal(1)
		expect(invite.event.path).to.equal('test/path')
		expect(invite.event.eventUid).to.equal('test-uid')
		expect(invite.learnerEmail).to.equal('test@email.com')
	})
})
