import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import { Request, Response } from 'express'
import { OrganisationController } from '../../../../src/controllers/organisation/organisationController'
import { OrganisationFactory } from '../../../../src/learning-catalogue/model/factory/organisationFactory'
import { Organisation } from '../../../../src/learning-catalogue/model/organisation'
import { Validator } from '../../../../src/learning-catalogue/validator/validator'
import { Csrs } from 'src/csrs';

chai.use(sinonChai)

describe('Organisation Controller Tests', function () {

    let organisationController: OrganisationController
    let organisationFactory: OrganisationFactory
    let organisationValidator: Validator<Organisation>
    let csrs: Csrs
    let req: Request
    let res: Response

    beforeEach(() => {
        csrs = <Csrs>{}
        organisationFactory = <OrganisationFactory>{}
        organisationValidator = <Validator<Organisation>>{}
        organisationController = new OrganisationController(
            organisationFactory,
            organisationValidator,
            csrs
        )


        req = mockReq()
        res = mockRes()

        req.session!.save = callback => {
            callback(undefined)
        }
    })

    it('should call get add organisation page ', async function () {
        await organisationController.addOrganisation()(req, res)
        expect(res.render).to.have.been.calledOnceWith('page/organisation/add-organisation')
    })

    it('should call set add organisation page and redirect if errors', async function () {
        req.body = { name: '' }
        const organisationId = "abc"
        const organisation = new Organisation()
        organisationFactory.create = sinon.stub().returns(organisation)

        const errors = { fields: [], size: 0 }
        organisationValidator.check = sinon.stub().returns(errors)

        await organisationController.setOrganisation()(req, res)

        expect(organisationFactory.create).to.have.been.calledWith(req.body)
        expect(organisationValidator.check).to.have.been.calledWith(req.body, ['name'])
        expect(organisationValidator.check).to.have.returned(errors)
        expect(csrs.createOrganisation).to.have.been.calledWith(organisation)
    })
})
