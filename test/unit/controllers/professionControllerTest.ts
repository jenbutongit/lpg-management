import {beforeEach, describe, it} from 'mocha'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import {expect} from 'chai'
import * as sinonChai from 'sinon-chai'
import {Request, Response} from 'express'
import * as sinon from 'sinon'
import {ProfessionController} from '../../../src/controllers/professionController'
import {Csrs} from '../../../src/csrs'
import {Profession} from '../../../src/csrs/model/profession'
import {PageResults} from '../../../src/learning-catalogue/model/pageResults'
import {ProfessionFactory} from '../../../src/csrs/model/factory/professionFactory'
import {Validator} from '../../../src/learning-catalogue/validator/validator'

chai.use(sinonChai)

describe('Profession Controller Tests', function() {
	let professionController: ProfessionController
	let csrs: Csrs
	let professionFactory: ProfessionFactory
	let validator: Validator<Profession>

	let req: Request
	let res: Response

	beforeEach(() => {
		csrs = <Csrs>{}
		professionFactory = <ProfessionFactory>{}
		validator = <Validator<Profession>>{}
		professionController = new ProfessionController(csrs, professionFactory, validator)

		req = mockReq()
		res = mockRes()

		req.session!.save = callback => {
			callback(undefined)
		}
	})

	it('should call manage professions page with professions list', async function() {
		const profession: Profession = new Profession()

		const pageResults: PageResults<Profession> = {
			page: 0,
			size: 10,
			totalResults: 10,
			results: [profession],
		} as PageResults<Profession>

		const getProfessions: (request: Request, response: Response) => void = professionController.getProfessions()

		let listProfessions = sinon.stub().returns(Promise.resolve(pageResults))
		csrs.listProfessions = listProfessions

		await getProfessions(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/profession/manage-professions', {professions: pageResults})
	})

	it('should call add professions page with professions typeahead list', async function() {
		const profession: Profession = new Profession()

		const pageResults: PageResults<Profession> = {
			page: 0,
			size: 10,
			totalResults: 10,
			results: [profession],
		} as PageResults<Profession>

		const addProfession: (request: Request, response: Response) => void = professionController.addProfession()

		let listProfessionsForTypehead = sinon.stub().returns(Promise.resolve(pageResults))
		csrs.listProfessionsForTypehead = listProfessionsForTypehead

		await addProfession(req, res)

		expect(res.render).to.have.been.calledOnceWith('page/profession/add-profession')
	})

	it('should check for profession errors and redirect to manage profession page if no errors', async function() {
		const errors = {fields: [], size: 0}
		const profession = new Profession()
		profession.name = 'New profession'

		professionFactory.create = sinon.stub().returns(profession)
		validator.check = sinon.stub().returns({fields: [], size: 0})
		csrs.createProfession = sinon.stub().returns('123')

		const createProfession = professionController.createProfession()
		await createProfession(req, res)

		expect(validator.check).to.have.been.calledWith(req.body, ['all'])
		expect(validator.check).to.have.returned(errors)
		expect(res.redirect).to.have.been.calledWith('/content-management/professions')
	})

	it('should check for profession errors and redirect to add profession page if errors', async function() {
		const errors = {
			fields: ['validation.professions.name.empty'],
			size: 1,
		}
		const profession = new Profession()
		profession.name = 'New profession'

		professionFactory.create = sinon.stub().returns(profession)
		validator.check = sinon.stub().returns(errors)
		csrs.createProfession = sinon.stub().returns('123')

		const createProfession = professionController.createProfession()
		await createProfession(req, res)

		expect(validator.check).to.have.been.calledWith(req.body, ['all'])
		expect(validator.check).to.have.returned(errors)
		expect(res.redirect).to.have.been.calledWith('/content-management/add-profession')
	})
})
