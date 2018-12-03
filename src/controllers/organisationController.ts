import {NextFunction, Request, Response, Router} from 'express'
import {OrganisationalUnit} from '../csrs/model/organisationalUnit'
import {Csrs} from '../csrs/index'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'
import * as asyncHandler from 'express-async-handler'
import {OrganisationalUnitFactory} from '../csrs/model/organisationalUnitFactory'
import {FormController} from './formController'
import {Validator} from '../learning-catalogue/validator/validator'
import {Validate} from './formValidator'
import {OrganisationalUnitService} from "../csrs/service/organisationalUnitService"

export class OrganisationController implements FormController {
	router: Router
	csrs: Csrs
	organisationalUnitFactory: OrganisationalUnitFactory
	validator: Validator<OrganisationalUnit>
	organisationalUnitService: OrganisationalUnitService

	constructor(csrs: Csrs, organisationalUnitFactory: OrganisationalUnitFactory, validator: Validator<OrganisationalUnit>, organisationalUnitService: OrganisationalUnitService) {
		this.router = Router()
		this.csrs = csrs
		this.organisationalUnitFactory = organisationalUnitFactory
		this.validator = validator
		this.organisationalUnitService = organisationalUnitService

		this.getOrganisationFromRouterParamAndSetOnLocals()

		this.setRouterPaths()
	}

	// prettier-ignore
	private getOrganisationFromRouterParamAndSetOnLocals() {
		this.router.param('organisationalUnitId', asyncHandler(async (req: Request, res: Response, next: NextFunction, organisationalUnitId: string) => {
				const organisationalUnit: OrganisationalUnit = await this.organisationalUnitService.getOrganisationalUnit(`organisationalUnits/${organisationalUnitId}`)

				if (organisationalUnit) {
					res.locals.organisationalUnit = organisationalUnit
					next()
				} else {
					res.sendStatus(404)
				}
			})
		)
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/organisations', asyncHandler(this.getOrganisations()))
		this.router.get('/content-management/add-organisation/:organisationalUnitId?', asyncHandler(this.addOrganisation()))
		this.router.get('/content-management/organisations/:organisationalUnitId/overview', asyncHandler(this.getOrganisation()))
		this.router.post('/content-management/add-organisation/', asyncHandler(this.createOrganisation()))
		this.router.post('/content-management/add-organisation/:organisationalUnitId', asyncHandler(this.updateOrganisation()))
	}

	public getOrganisations() {
		return async (request: Request, response: Response) => {
			const organisationalUnits: DefaultPageResults<OrganisationalUnit> = await this.csrs.listOrganisationalUnits()

			response.render('page/organisation/manage-organisations', {organisationalUnits: organisationalUnits})
		}
	}

	public getOrganisation() {
		return async (request: Request, response: Response) => {
			const organisationalUnit = response.locals.organisationalUnit

			response.render('page/organisation/organisation-overview', {organisationalUnit: organisationalUnit})
		}
	}

	public addOrganisation() {
		return async (request: Request, response: Response) => {
			const organisationalUnits: DefaultPageResults<OrganisationalUnit> = await this.csrs.listOrganisationalUnitsForTypehead()

			response.render('page/organisation/add-organisation', {organisationalUnits: organisationalUnits})
		}
	}

	@Validate({
		fields: ['all'],
		redirect: '/content-management/add-organisation',
	})
	public createOrganisation() {
		return async (request: Request, response: Response) => {
			const organisationalUnit = this.organisationalUnitFactory.create(request.body)

			try {
				const newOrganisationalUnit: OrganisationalUnit = await this.csrs.createOrganisationalUnit(organisationalUnit)

				request.session!.sessionFlash = {organisationAddedSuccessMessage: 'organisationAddedSuccessMessage'}

				response.redirect(`/content-management/organisations/${newOrganisationalUnit.id}/overview`)
			} catch (e) {
				const errors = {fields: {fields: ['organisations.validation.organisation.alreadyExists'], size: 1}}

				request.session!.sessionFlash = {errors: errors}

				return request.session!.save(() => {
					response.redirect(`/content-management/add-organisation`)
				})
			}
		}
	}

	@Validate({
		fields: ['all'],
		redirect: '/content-management/add-organisation/:organisationId',
	})
	public updateOrganisation(){
		return async (request: Request, response: Response) => {
			let organisationalUnit = response.locals.organisationalUnit

			const data = {
				name: request.body.name || organisationalUnit.name,
				abbreviation: request.body.abbreviation || organisationalUnit.abbreviation,
				code: request.body.code || organisationalUnit.code,
				parent: request.body.parent,
			}

			await this.csrs.updateOrganisationalUnit(organisationalUnit.id, data)

			response.redirect(`/content-management/organisations/${organisationalUnit.id}/overview`)
		}
	}
}
