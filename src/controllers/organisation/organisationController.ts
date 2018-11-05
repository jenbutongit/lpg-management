import { Request, Response, Router } from 'express'
export class organisationController {
    router: Router

    constructor(

    ) {

        this.router = Router()

        this.setRouterPaths()
    }

    /* istanbul ignore next */
    private setRouterPaths() {
        this.router.get('/content-management/organisations', this.getOrganisations())
        this.router.get('/content-management/add-organisation', this.addOrganisation())

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

}
