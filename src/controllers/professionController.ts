import {Request, Response, Router} from 'express'
import {Profession} from '../csrs/model/profession'
import {Csrs} from '../csrs'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'
import * as asyncHandler from 'express-async-handler'
import {ProfessionFactory} from '../csrs/model/factory/professionFactory'
import {FormController} from './formController'
import {Validator} from '../learning-catalogue/validator/validator'
import {Validate} from './formValidator'

export class ProfessionController implements FormController {
	router: Router
	csrs: Csrs
	professionFactory: ProfessionFactory
	validator: Validator<Profession>

	constructor(csrs: Csrs, professionFactory: ProfessionFactory, validator: Validator<Profession>) {
		this.router = Router()
		this.csrs = csrs
		this.professionFactory = professionFactory
		this.validator = validator

		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/professions', asyncHandler(this.getProfessions()))
		this.router.get('/content-management/add-profession', asyncHandler(this.addProfession()))
		this.router.get('/content-management/professions/:professionId/overview', asyncHandler(this.getProfession()))
		this.router.post('/content-management/professions/profession', asyncHandler(this.createProfession()))
	}

	public getProfessions() {
		return async (request: Request, response: Response) => {
			const professions: DefaultPageResults<Profession> = await this.csrs.listProfessions()

			response.render('page/profession/manage-professions', {professions: professions})
		}
	}

	public getProfession() {
		return async (request: Request, response: Response) => {
			response.render('/content-management/professions')
		}
	}

	public addProfession() {
		return async (request: Request, response: Response) => {
			const professions: DefaultPageResults<Profession> = await this.csrs.listProfessionsForTypehead()

			response.render('page/profession/add-profession', {professions: professions})
		}
	}
	@Validate({
		fields: ['all'],
		redirect: '/content-management/add-profession',
	})
	public createProfession() {
		return async (request: Request, response: Response) => {
			const profession = this.professionFactory.create(request.body)

			await this.csrs.createProfession(profession)

			response.redirect(`/content-management/professions`)
		}
	}
}
