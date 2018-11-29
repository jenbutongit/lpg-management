import {beforeEach, describe, it} from 'mocha'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {EntityService} from '../../../src/learning-catalogue/service/entityService'
import {Auth} from '../../../src/identity/auth'
import {OrganisationalUnit} from '../../../src/csrs/model/organisationalUnit'
import {Csrs} from '../../../src/csrs'
import {CsrsConfig} from '../../../src/csrs/csrsConfig'
import {Profession} from '../../../src/csrs/model/profession'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('CSRS tests', () => {
	let organisationalUnitService: EntityService<OrganisationalUnit>
	let professionService: EntityService<Profession>

	const config = new CsrsConfig('http://example.org', 1500)

	let csrs: Csrs

	beforeEach(() => {
		organisationalUnitService = <EntityService<OrganisationalUnit>>{}
		professionService = <EntityService<Profession>>{}

		csrs = new Csrs(config, {} as Auth)
		csrs.organisationalUnitService = organisationalUnitService
		csrs.professionService = professionService
	})

	it('should call organisationalUnitService when listing organisational units', async () => {
		organisationalUnitService.listAll = sinon.stub()

		await csrs.listOrganisationalUnits()

		return expect(organisationalUnitService.listAll).to.have.been.calledOnceWith(`/organisationalUnits/tree`)
	})

	it('should call organisationalUnitService when listing organisational units for typeahead', async () => {
		organisationalUnitService.listAllAsRawData = sinon.stub()

		await csrs.listOrganisationalUnitsForTypehead()

		return expect(organisationalUnitService.listAllAsRawData).to.have.been.calledOnceWith(`/organisationalUnits/flat`)
	})

	it('should call organisationalUnitService when creating organisational units', async () => {
		const organsationalUnit: OrganisationalUnit = new OrganisationalUnit()

		organisationalUnitService.create = sinon.stub()

		await csrs.createOrganisationalUnit(organsationalUnit)

		return expect(organisationalUnitService.create).to.have.been.calledOnceWith(`/organisationalUnits/`, organsationalUnit)
	})

	it('should call professionService when listing professions', async () => {
		professionService.listAll = sinon.stub()

		await csrs.listProfessions()

		return expect(professionService.listAll).to.have.been.calledOnceWith(`/professions/tree`)
	})

	it('should call professionService when listing professions for typeahead', async () => {
		professionService.listAllAsRawData = sinon.stub()

		await csrs.listProfessionsForTypehead()

		return expect(professionService.listAllAsRawData).to.have.been.calledOnceWith(`/professions/flat`)
	})

	it('should call professionService when creating professions', async () => {
		const profession: Profession = new Profession()

		professionService.create = sinon.stub()

		await csrs.createProfession(profession)

		return expect(professionService.create).to.have.been.calledOnceWith(`/professions/`, profession)
	})
})
