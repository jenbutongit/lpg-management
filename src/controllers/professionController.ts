import {NextFunction, Request, Response, Router} from 'express'
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

		this.getProfessionFromRouterParamAndSetOnLocals()

		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/professions', asyncHandler(this.professionsOverview()))
		this.router.get('/content-management/add-profession', asyncHandler(this.addProfession()))
		this.router.post('/content-management/professions/profession/create', asyncHandler(this.createProfession()))
		this.router.get('/content-management/professions/:professionId/view', asyncHandler(this.viewProfession()))
		this.router.get('/content-management/professions/:professionId/edit', asyncHandler(this.editProfession()))
		this.router.post('/content-management/professions/:professionId/update', asyncHandler(this.updateProfession()))
		this.router.post('/content-management/professions/:professionId/delete', asyncHandler(this.deleteProfession()))
	}

	private getProfessionFromRouterParamAndSetOnLocals() {
		this.router.param('professionId', asyncHandler(async (req: Request, res: Response, next: NextFunction, professionId: string) => {
				const profession = await this.csrs.getProfession(Number.parseInt(professionId))

				if (profession) {
					res.locals.profession = profession
					next()
				} else {
					res.sendStatus(404)
				}
			})
		)
	}

	public professionsOverview() {
		return async (request: Request, response: Response) => {
			const professions: DefaultPageResults<Profession> = await this.csrs.listProfessions()

			response.render('page/profession/manage-professions', {professions: professions})
		}
	}

	public viewProfession() {
		return async (request: Request, response: Response) => {
			response.render('/page/profession/view')
		}
	}

	public addProfession() {
		return async (request: Request, response: Response) => {
			const professions: DefaultPageResults<Profession> = await this.csrs.listProfessionsForTypehead()

			response.render('page/profession/add', {professions: professions})
		}
	}

	public editProfession() {
		return async (request: Request, response: Response) => {
			const professions: DefaultPageResults<Profession> = await this.csrs.listProfessionsForTypehead()

			response.render('page/profession/edit', {professions})
		}
	}

	@Validate({
		fields: ['name'],
		redirect: '/content-management/add-profession',
	})
	public createProfession() {
		return async (request: Request, response: Response) => {
			const profession = this.professionFactory.create(request.body)

			await this.csrs.createProfession(profession)

			response.redirect(`/content-management/professions`)
		}
	}

	@Validate({
		fields: ['name'],
		redirect: '/content-management/professions/:professionId/edit',
	})
	public updateProfession() {
		return async (request: Request, response: Response) => {
			const profession = this.professionFactory.create(request.body)

			await this.csrs.updateProfession(profession)

			response.redirect(`/content-management/professions`)
		}
	}

	public deleteProfession() {
		return async (request: Request, response: Response) => {
			await this.csrs.deleteProfession(request.body.professionId)

			response.redirect(`/content-management/professions`)
		}
	}
}
