import {beforeEach, describe, it} from 'mocha'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {HalService} from "lib/halService"
import {OrganisationalUnitFactory} from "../../../../src/csrs/model/organisationalUnitFactory"
import {OrganisationalUnit} from "../../../../src/csrs/model/organisationalUnit"
import {OrganisationalUnitService} from "../../../../src/csrs/service/organisationalUnitService"

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('OrganisationalUnitService tests', () => {
	let halService: HalService
	let organisationalUnitFactory: OrganisationalUnitFactory
	let organisationalUnitService: OrganisationalUnitService
	let resource: any
	let data: any

	beforeEach(() => {
		halService = <HalService>{}
		organisationalUnitFactory = <OrganisationalUnitFactory>{}
		organisationalUnitService = new OrganisationalUnitService(halService, organisationalUnitFactory)

		resource = getResource(resource)
		data = getData(resource)
	})

	it('should get organisation', async () => {
		const expectedOrganisationalUnit: OrganisationalUnit= new OrganisationalUnit()

		halService.getResource = sinon.stub().returns(resource)
		halService.getLink = sinon.stub().returns(resource)
		organisationalUnitFactory.create = sinon.stub().returns(expectedOrganisationalUnit)

		const result = await organisationalUnitService.getOrganisationalUnit('organisationalUnits/1')

		expect(organisationalUnitFactory.create).to.have.been.calledWith(data)
		expect(result).to.eql(expectedOrganisationalUnit)
	})

	it('should get parent from resource if parent exists', async () => {
		halService.getLink = sinon.stub().returns(resource)

		const expectedOrganisationalUnit: OrganisationalUnit = new OrganisationalUnit()
		organisationalUnitFactory.create = sinon.stub().returns(expectedOrganisationalUnit)

		const result = await organisationalUnitService.getParentFromResource(resource)

		expect(halService.getLink).to.have.been.calledWith(resource, 'parent')
		expect(result).to.eql(expectedOrganisationalUnit)
	})

	it('should return undefined if parent does not exist', async () => {
		halService.getLink = sinon.stub().returns(undefined)

		const result = await organisationalUnitService.getParentFromResource(resource)

		expect(halService.getLink).to.have.been.calledWith(resource, 'parent')
		expect(result).to.eql(undefined)
	})

	it('should get data from resource', async () => {
		data = {
			abbreviation: 'abbr',
			code: 'code',
			id: '',
			links: {},
			name: 'name',
			paymentMethods: [],
			subOrgs: [],
			uri: 'http://www.example.com/1'
		}

		halService.getLink = sinon.stub().returns(resource)
		const expectedOrganisationalUnit: OrganisationalUnit = new OrganisationalUnit()

		organisationalUnitFactory.create = sinon.stub().returns(expectedOrganisationalUnit)

		const result = await organisationalUnitService.getDataFromResource(resource)
		expect(result).to.eql(data)
	})

	it('should get uri from resource', async () => {
		const resource: any = {}

		const uri = 'http://www.example.com/1'

		resource.uri = {uri: uri}

		const result = await organisationalUnitService.getUri(resource)

		expect(result).to.eql(uri)
	})

})

function getData(resource: any) {
	const orgUnit = resource.props

	const data = {
		id: orgUnit.id,
		name: orgUnit.name,
		code: orgUnit.code,
		abbreviation: orgUnit.abbreviation,
		paymentMethods: orgUnit.paymentMethods,
		subOrgs: orgUnit.subOrgs,
		links: {},
		parent: orgUnit.parent,
		uri: 'http://www.example.com/1'
	}

	return data
}

function getResource(resource: any){
	resource = {}
	resource.props = {}
	resource.props.id = ''
	resource.props.name = 'name'
	resource.props.code = 'code'
	resource.props.abbreviation = 'abbr'
	resource.props.paymentMethods = []
	resource.props.subOrgs = []
	resource.links = {}
	resource.props.parent = new OrganisationalUnit()
	resource.uri = {uri: 'http://www.example.com/1'}

	return resource
}