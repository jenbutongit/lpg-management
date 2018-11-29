import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {expect} from 'chai'
import {InviteFactory} from '../../../../../src/learner-record/model/factory/inviteFactory'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Invite factory tests', () => {
	let inviteFactory: InviteFactory

	beforeEach(() => {
		inviteFactory = new InviteFactory()
	})

	it('should be create invite from data', () => {
		const data = {
			id: 'test-id',
			event: 'test/path/to/event',
			learnerEmail: 'test@email.com',
		}

		const invite = inviteFactory.create(data)

		expect(invite.id).to.equal('test-id')
		expect(invite.event).to.equal('test/path/to/event')
		expect(invite.learnerEmail).to.equal('test@email.com')
	})
})
