import {IdentityService} from '../../../src/identity/identityService'
import {AxiosInstance} from 'axios'
import * as sinon from 'sinon'
import {expect} from 'chai'

describe('IdentityService tests...', function() {
	let identityService: IdentityService
	const http: AxiosInstance = <AxiosInstance>{}

	beforeEach(function() {
		identityService = new IdentityService(http)
	})

	it('getDetails() should return async call to Identity Service', function() {
		const token: string = 'test-token'

		const axiosGet = sinon
			.stub()
			.withArgs(`/oauth/resolve`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.returns({data: 'test-data'})

		http.get = axiosGet

		const returnValue = identityService.getDetails(token)

		returnValue.then(function(data) {
			expect(data).to.equal('test-data')
		})
	})
})
