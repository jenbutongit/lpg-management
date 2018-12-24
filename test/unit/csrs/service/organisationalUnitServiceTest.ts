import {beforeEach, describe, it} from 'mocha'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import {expect} from 'chai'
import {Csrs} from '../../../../src/csrs'
import {OrganisationalUnitFactory} from '../../../../src/csrs/model/organisationalUnitFactory'
import {OrganisationalUnitService} from '../../../../src/csrs/service/organisationalUnitService'
import {OrganisationalUnit} from '../../../../src/csrs/model/organisationalUnit'

chai.use(sinonChai)

describe('OrganisationalUnitService tests', () => {
	let csrs: Csrs
	let organisationalUnitFactory: OrganisationalUnitFactory
	let organisationalUnitService: OrganisationalUnitService

	beforeEach(() => {
		csrs = <Csrs>{}
		organisationalUnitFactory = <OrganisationalUnitFactory>{}
		organisationalUnitService = new OrganisationalUnitService(csrs, organisationalUnitFactory)
	})

	it('should get organisationalUnit data', async () => {
		let uri = '1'
		const organisationalUnit: OrganisationalUnit = new OrganisationalUnit()
		organisationalUnit.id = uri

		const parent: OrganisationalUnit = new OrganisationalUnit()
		parent.id = '2'

		const organisation = sinon
			.stub()
			.withArgs(uri)
			.resolves(organisationalUnit)
		csrs.getOrganisationalUnit = organisation

		const parentOrg = sinon
			.stub()
			.withArgs(`${uri}/parent`)
			.resolves(parent)
		csrs.getOrganisationalUnit = parentOrg

		const getOrganisationalUnit = sinon.stub().returns(organisationalUnit)
		organisationalUnitFactory.create = getOrganisationalUnit

		const data = {
			id: '1',
		}

		const result = await organisationalUnitService.getOrganisationalUnit(uri)

		expect(result).to.eql(data)
	})
})
