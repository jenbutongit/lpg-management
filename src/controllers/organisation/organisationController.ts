import {Request, Response, Router} from 'express'
import {OrganisationalUnit} from './model/organisationalUnit'
import {Csrs} from '../../csrs'
import {DefaultPageResults} from '../../learning-catalogue/model/defaultPageResults'
import * as asyncHandler from 'express-async-handler'

export class OrganisationController {
	router: Router
	csrs: Csrs

	constructor(csrs: Csrs) {
		this.router = Router()
		this.csrs = csrs

		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/organisations', asyncHandler(this.getOrganisations()))
		this.router.get('/content-management/add-organisation', asyncHandler(this.addOrganisation()))
	}

	public getOrganisations() {
		return async (request: Request, response: Response) => {
			const organisationalUnits: DefaultPageResults<OrganisationalUnit> = await this.csrs.listOrganisationalUnits()

			response.render('page/organisation/manage-organisations', {organisationalUnits: organisationalUnits})
		}
	}

	public addOrganisation() {
		return async (request: Request, response: Response) => {
			const organisationalUnits: DefaultPageResults<OrganisationalUnit> = await this.csrs.listOrganisationalUnitsForTypehead()

			response.render('page/organisation/add-organisation', {organisationalUnits: organisationalUnits})
		}
	}
}
