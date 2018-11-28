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
	beforeEach(() => {
		halService = <HalService>{}
		organisationalUnitFactory = <OrganisationalUnitFactory>{}
		organisationalUnitService = new OrganisationalUnitService(halService, organisationalUnitFactory)

	})

	it('should get organisation', async () => {
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

		const orgUnit = resource.props
		const data = {
			id: orgUnit.id,
			name: orgUnit.name,
			code: orgUnit.code,
			abbreviation: orgUnit.abbreviation,
			paymentMethods: orgUnit.paymentMethods,
			subOrgs: orgUnit.subOrgs,
			links: {},
			parent: orgUnit.parent
		}

		const expectedOrganisationalUnit: OrganisationalUnit= new OrganisationalUnit()

		halService.getResource = sinon.stub().returns(resource)
		halService.getLink = sinon.stub().returns(resource)
		organisationalUnitFactory.create = sinon.stub().returns(expectedOrganisationalUnit)

		const result = await organisationalUnitService.getOrganisationalUnit('organisationalUnits/1')

		expect(organisationalUnitFactory.create).to.have.been.calledWith(data)
		expect(result).to.eql(expectedOrganisationalUnit)
	})

	it('should get parent from resource if parent exists', async () => {
		const resource: any = {}
		const parentResource: any = {}

		halService.getLink = sinon.stub().returns(parentResource)

		const expectedOrganisationalUnit: OrganisationalUnit = new OrganisationalUnit()
		organisationalUnitFactory.create = sinon.stub().returns(expectedOrganisationalUnit)

		const result = await organisationalUnitService.getParentFromResource(resource)

		expect(halService.getLink).to.have.been.calledWith(resource, 'parent')
		expect(result).to.eql(expectedOrganisationalUnit)
	})

	it('should return undefined if parent does not exist', async () => {
		const resource: any = {}

		halService.getLink = sinon.stub().returns(undefined)

		const result = await organisationalUnitService.getParentFromResource(resource)

		expect(halService.getLink).to.have.been.calledWith(resource, 'parent')
		expect(result).to.eql(undefined)
	})
})
