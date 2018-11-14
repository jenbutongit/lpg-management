import {Request, Response, Router} from 'express'
import {OrganisationalUnit} from './model/organisationalUnit'
import {Csrs} from '../../csrs'
import {DefaultPageResults} from '../../learning-catalogue/model/defaultPageResults'
import * as asyncHandler from 'express-async-handler'
import {OrganisationalUnitFactory} from './model/organisationalUnitFactory'

export class OrganisationController {
	router: Router
	csrs: Csrs
	organisationalUnitFactory: OrganisationalUnitFactory

	constructor(csrs: Csrs, organisationalUnitFactory: OrganisationalUnitFactory) {
		this.router = Router()
		this.csrs = csrs
		this.organisationalUnitFactory = organisationalUnitFactory

		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/organisations', asyncHandler(this.getOrganisations()))
		this.router.get('/content-management/add-organisation', asyncHandler(this.addOrganisation()))
		this.router.get('/content-management/organisations/organisation/:organisationId?', asyncHandler(this.getOrganisation()))
		this.router.post('/content-management/organisations/organisation', asyncHandler(this.createOrganisation()))
	}

	public getOrganisations() {
		return async (request: Request, response: Response) => {
			const organisationalUnits: DefaultPageResults<OrganisationalUnit> = await this.csrs.listOrganisationalUnits()

			response.render('page/organisation/manage-organisations', {organisationalUnits: organisationalUnits})
		}
	}

	public getOrganisation() {
		return async (request: Request, response: Response) => {
			response.render('/content-management/organisations')
		}
	}

	public addOrganisation() {
		return async (request: Request, response: Response) => {
			const organisationalUnits: DefaultPageResults<OrganisationalUnit> = await this.csrs.listOrganisationalUnitsForTypehead()

			response.render('page/organisation/add-organisation', {organisationalUnits: organisationalUnits})
		}
	}

	public createOrganisation() {
		return async (request: Request, response: Response) => {
			const parentOrganisationalUnit = await this.csrs.getOrganisationalUnitByCode(request.body['last-location'])

			const data = {...request.body, parent: parentOrganisationalUnit}

			const organisationalUnit = this.organisationalUnitFactory.create(data)
			const savedOrganisationalUnit = await this.csrs.createOrganisationalUnit(organisationalUnit)

			response.redirect(`/content-management/organisations/organisation/${savedOrganisationalUnit.id}`)
		}
	}
}
