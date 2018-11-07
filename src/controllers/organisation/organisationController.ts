import { Request, Response, Router } from 'express'
import { OrganisationFactory } from '../../learning-catalogue/model/factory/organisationFactory'
import { Validator } from '../../learning-catalogue/validator/validator'
import { Organisation } from '../../learning-catalogue/model/organisation'
import { Csrs } from '../../csrs/'

export class OrganisationController {
    organisationFactory: OrganisationFactory
    organisationValidator: Validator<Organisation>
    csrs: Csrs
    router: Router

    constructor(
        organisationFactory: OrganisationFactory,
        organisationValidator: Validator<Organisation>,
        csrs: Csrs
    ) {
        this.organisationFactory = organisationFactory
        this.organisationValidator = organisationValidator
        this.csrs = csrs

        this.router = Router()
        this.setRouterPaths()
    }

    /* istanbul ignore next */
    private setRouterPaths() {
        this.router.get('/content-management/add-organisation', this.addOrganisation())
        this.router.post('/content-management/add-organisation', this.setOrganisation())
    }

    public addOrganisation() {

        return async (request: Request, response: Response) => {

            response.render('page/organisation/add-organisation')
        }
    }

    public setOrganisation() {
        return async (req: Request, res: Response) => {
            const data = { ...req.body }
            const organisation = this.organisationFactory.create(data)
            const errors = await this.organisationValidator.check(req.body, ['name'])

            if (errors.size) {
                req.session!.sessionFlash = { errors: errors }
                req.session!.save(() => {
                    res.redirect('/content-management/add-organisation')
                })
            } else {
                const newOrganisation = await this.csrs.createOrganisation(organisation)
                res.redirect('/content-management/organisation-overview/' + newOrganisation.id)
            }
        }
    }

}
