import { EntityService } from "../learning-catalogue/service/entityService"
import { Organisation } from "../learning-catalogue/model/organisation"
import { OauthRestService } from "../lib/http/oauthRestService"
import { OrganisationFactory } from "../learning-catalogue/model/factory/organisationFactory"
import { CsrsConfig } from "./csrsConfig"
import { Auth } from '../identity/auth'

export class Csrs {
    private _organisationService: EntityService<Organisation>
    private _restService: OauthRestService

    constructor(
        config: CsrsConfig, auth: Auth
    ) {
        this._restService = new OauthRestService(config, auth)
        this._organisationService = new EntityService<Organisation>(this._restService, new OrganisationFactory())
    }

    async createOrganisation(organisation: Organisation): Promise<Organisation> {
        return this._organisationService.create(`/organisations/`, organisation)
    }

    async getOrganisation(organisationId: string): Promise<Organisation> {
        return this._organisationService.get(`/organisations/${organisationId}`)
    }
    async updateOrganisation(organisationId: string, organisation: Organisation): Promise<Organisation> {
        return this._organisationService.update(`/organisations/${organisationId}`, organisation)
    }

    async deleteOrganisation(organisationId: string) {
        return this._organisationService.delete(`/organisations/${organisationId}`)
    }
}