import {beforeEach, describe, it} from 'mocha'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import {expect} from 'chai'
import * as sinonChai from 'sinon-chai'
import {Request, Response} from 'express'
import * as sinon from 'sinon'
import {OrganisationController} from '../../../../src/controllers/organisation/organisationController'
import {Csrs} from '../../../../src/csrs'
import {OrganisationalUnit} from '../../../../src/controllers/organisation/model/organisationalUnit'
import {PageResults} from '../../../../src/learning-catalogue/model/pageResults'

chai.use(sinonChai)

describe('Organisation Controller Tests', function() {
	let organisationController: OrganisationController
	let csrs: Csrs

	let req: Request
	let res: Response

	beforeEach(() => {
		csrs = <Csrs>{}

		organisationController = new OrganisationController(csrs)

		req = mockReq()
		res = mockRes()

		req.session!.save = callback => {
			callback(undefined)
		}
	})

	it('should call manage organisations page with organisations list', async function() {
		const organisationalUnit: OrganisationalUnit = new OrganisationalUnit()

		const pageResults: PageResults<OrganisationalUnit> = {
			page: 0,
			size: 10,
			totalResults: 10,
			results: [organisationalUnit],
		} as PageResults<OrganisationalUnit>

		const getOrganisations: (request: Request, response: Response) => void = organisationController.getOrganisations()

		let listOrganisationalUnits = sinon.stub().returns(Promise.resolve(pageResults))
		csrs.listOrganisationalUnits = listOrganisationalUnits

		await getOrganisations(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/organisation/manage-organisations', {organisationalUnits: pageResults})
	})

	it('should call add organisations page', async function() {
		const addOrganisation: (request: Request, response: Response) => void = organisationController.addOrganisation()

		await addOrganisation(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/organisation/add-organisation')
	})
})
