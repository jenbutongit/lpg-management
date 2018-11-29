import {EntityService} from '../learning-catalogue/service/entityService'
import {OrganisationalUnit} from './model/organisationalUnit'
import {OauthRestService} from '../lib/http/oauthRestService'
import {Auth} from '../identity/auth'
import {OrganisationalUnitFactory} from './model/factory/organisationalUnitFactory'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'
import {CsrsConfig} from './csrsConfig'
import {Profession} from './model/profession'
import {ProfessionFactory} from './model/factory/professionFactory'

export class Csrs {
	private _organisationalUnitService: EntityService<OrganisationalUnit>
	private _professionService: EntityService<Profession>
	private _restService: OauthRestService

	constructor(config: CsrsConfig, auth: Auth) {
		this._restService = new OauthRestService(config, auth)
		this._organisationalUnitService = new EntityService<OrganisationalUnit>(this._restService, new OrganisationalUnitFactory())
		this._professionService = new EntityService<Profession>(this._restService, new ProfessionFactory())
	}

	async listOrganisationalUnits(): Promise<DefaultPageResults<OrganisationalUnit>> {
		return await this._organisationalUnitService.listAll(`/organisationalUnits/tree`)
	}

	async listOrganisationalUnitsForTypehead(): Promise<DefaultPageResults<OrganisationalUnit>> {
		return await this._organisationalUnitService.listAllAsRawData(`/organisationalUnits/flat`)
	}

	async createOrganisationalUnit(organisationalUnit: OrganisationalUnit): Promise<OrganisationalUnit> {
		return await this._organisationalUnitService.create(`/organisationalUnits/`, organisationalUnit)
	}

	set organisationalUnitService(value: EntityService<OrganisationalUnit>) {
		this._organisationalUnitService = value
	}

	async listProfessions(): Promise<DefaultPageResults<Profession>> {
		return await this._professionService.listAll(`/professions/tree`)
	}

	async listProfessionsForTypehead(): Promise<DefaultPageResults<Profession>> {
		return await this._professionService.listAllAsRawData(`/professions/flat`)
	}

	async createProfession(profession: Profession): Promise<Profession> {
		return await this._professionService.create(`/professions/`, profession)
	}

	set professionService(value: EntityService<Profession>) {
		this._professionService = value
	}

}
