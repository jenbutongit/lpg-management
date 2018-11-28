import {beforeEach, describe, it} from 'mocha'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import {expect} from 'chai'
import {createClient, HalRestClient} from "hal-rest-client";
import * as chaiAsPromised from 'chai-as-promised'
import {HalService} from '../../../src/lib/halService'
import {OrganisationalUnit} from "../../../src/csrs/model/organisationalUnit"

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('HalService tests', () => {

	let client: HalRestClient
	let halService: HalService

	beforeEach(() => {
		client = createClient('https://www.example.com/');
		halService = new HalService(client)
	})

	it('should get resource', async () => {
		const resource: any = {}
		resource.props = {}
		resource.props.id = ''
		resource.props.name = 'name'
		resource.props.code = 'code'
		resource.props.abbreviation = 'abbr'
		resource.props.paymentMethods = []
		resource.props.subOrgs = []
		resource.links = {}
		resource.props.parent = new OrganisationalUnit()

		client.fetchResource = sinon.stub().returns(resource)

		const expectedResource = await halService.getResource('organisationalUnits/1')

		expect(expectedResource).to.eql(resource)
	})
})
