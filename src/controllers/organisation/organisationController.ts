import {Request, Response, Router} from 'express'
export class organisationController {
	router: Router

	constructor() {
		this.router = Router()
		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/organisations', this.getOrganisations())
		this.router.get('/content-management/add-organisation', this.addOrganisation())

		this.router.get('/content-management/organisation-overview', this.organisationView())
		this.router.get('/content-management/delete-organisation', this.deleteOrganisation())
	}

	public getOrganisations() {
		return async (request: Request, response: Response) => {
			response.render('page/organisation/organisations')
		}
	}

	public addOrganisation() {
		return async (request: Request, response: Response) => {
			response.render('page/organisation/add-organisation')
		}
	}

	public organisationView() {
		return async (request: Request, response: Response) => {
			response.render('page/organisation/organisation-overview')
		}
	}

	public deleteOrganisation() {
		return async (request: Request, response: Response) => {
			response.render('page/organisation/delete-organisation')
		}
	}
}
