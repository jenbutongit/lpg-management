import {beforeEach, describe, it} from 'mocha'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {CsrsService} from '../../../../src/csrs/service/csrsService'
import {OauthRestService} from 'lib/http/oauthRestService'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('CsrsService tests', () => {
	let csrsService: CsrsService
	let restService: OauthRestService

	beforeEach(() => {
		restService = <OauthRestService>{}
		csrsService = new CsrsService(restService)
	})

	it('should get organisation data', async () => {
		const data = [
			{
				code: 'co',
				name: 'Cabinet Office',
			},
			{
				code: 'dh',
				name: 'Department of Health & Social Care',
			},
		]

		restService.get = sinon
			.stub()
			.withArgs('organisations')
			.returns(data)

		const result = await csrsService.getOrganisations()

		expect(restService.get).to.have.been.calledOnceWith('organisations')
		expect(result).to.eql(data)
	})
})
