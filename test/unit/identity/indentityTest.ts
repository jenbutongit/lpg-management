import {describe, it} from 'mocha'
import {Identity} from '../../../src/identity/identity'
import {expect} from 'chai'

describe('Identity tests', () => {
	it('hasRoles() should return true if identity contains role', () => {
		const uid: string = 'user-id'
		const roles: string[] = ['role1', 'role2']
		const accessToken: string = 'access-token'

		const identity: Identity = new Identity(uid, roles, accessToken)

		expect(identity.hasRole('role1')).to.be.true
		expect(identity.hasRole('role2')).to.be.true
		expect(identity.hasRole('role3')).to.be.false
	})

	it('hasRoles() should return true if identity has any of the roles specified', () => {
		const uid: string = 'user-id'
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
})
