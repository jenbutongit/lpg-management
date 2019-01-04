import {describe, it} from 'mocha'
import {expect} from 'chai'
import {Identity} from '../../../src/identity/identity'

describe('Identity tests', () => {
	it('hasRoles() should return true if identity contains role', () => {
		const uid: string = 'user-_id'
		const roles: string[] = ['role1', 'role2']
		const accessToken: string = 'access-token'

		const identity: Identity = new Identity(uid, roles, accessToken)

		expect(identity.hasRole('role1')).to.be.true
		expect(identity.hasRole('role2')).to.be.true
		expect(identity.hasRole('role3')).to.be.false
	})

	it('hasRoles() should return true if identity has any of the roles specified', () => {
		const uid: string = 'user-_id'
		const roles: string[] = ['role1', 'role2']
		const accessToken: string = 'access-token'

		const identity: Identity = new Identity(uid, roles, accessToken)

		expect(identity.hasAnyRole(['role1'])).to.be.true
		expect(identity.hasAnyRole(['role2'])).to.be.true
		expect(identity.hasAnyRole(['role1', 'role2'])).to.be.true
		expect(identity.hasAnyRole(['role1', 'role3'])).to.be.true
		expect(identity.hasAnyRole(['role2', 'role3'])).to.be.true
		expect(identity.hasAnyRole(['role3'])).to.be.false
		expect(identity.hasAnyRole(['role3', 'role4'])).to.be.false
	})

	it('isOrganisationManager() should return true if identity has organisation_manager roles', () => {
		const accessToken: string = 'access-token'

		const orgManager: Identity = new Identity('id1', ['ORGANISATION_MANAGER'], accessToken)
		const learner: Identity = new Identity('id2', ['LEARNER'], accessToken)

		expect(orgManager.isOrganisationManager()).to.be.true
		expect(learner.isOrganisationManager()).to.be.false
	})

	it('hasLearningCreate() should return true if identity has LEARNING_CREATE, LEARNING_MANAGER or CSL_AUTHOR roles', () => {
		const accessToken: string = 'access-token'

		const creator: Identity = new Identity('id1', ['LEARNING_CREATE'], accessToken)
		const manager: Identity = new Identity('id1', ['LEARNING_MANAGER'], accessToken)
		const cslAuthor: Identity = new Identity('id1', ['CSL_AUTHOR'], accessToken)
		const learner: Identity = new Identity('id2', ['LEARNER'], accessToken)

		expect(creator.hasLearningCreate()).to.be.true
		expect(manager.hasLearningCreate()).to.be.true
		expect(cslAuthor.hasLearningCreate()).to.be.true
		expect(learner.hasLearningCreate()).to.be.false
	})

	it('hasLearningEdit() should return true if identity has LEARNING_CREATE, LEARNING_MANAGER or CSL_AUTHOR roles', () => {
		const accessToken: string = 'access-token'

		const editor: Identity = new Identity('id1', ['LEARNING_EDIT'], accessToken)
		const manager: Identity = new Identity('id1', ['LEARNING_MANAGER'], accessToken)
		const cslAuthor: Identity = new Identity('id1', ['CSL_AUTHOR'], accessToken)
		const learner: Identity = new Identity('id2', ['LEARNER'], accessToken)

		expect(editor.hasLearningEdit()).to.be.true
		expect(manager.hasLearningEdit()).to.be.true
		expect(cslAuthor.hasLearningEdit()).to.be.true
		expect(learner.hasLearningEdit()).to.be.false
	})

	it('hasLearningDelete() should return true if identity has LEARNING_DELETE, LEARNING_MANAGER or CSL_AUTHOR roles', () => {
		const accessToken: string = 'access-token'

		const deleteRole: Identity = new Identity('id1', ['LEARNING_DELETE'], accessToken)
		const manager: Identity = new Identity('id1', ['LEARNING_MANAGER'], accessToken)
		const cslAuthor: Identity = new Identity('id1', ['CSL_AUTHOR'], accessToken)
		const learner: Identity = new Identity('id2', ['LEARNER'], accessToken)

		expect(deleteRole.hasLearningDelete()).to.be.true
		expect(manager.hasLearningDelete()).to.be.true
		expect(cslAuthor.hasLearningDelete()).to.be.true
		expect(learner.hasLearningDelete()).to.be.false
	})
})
