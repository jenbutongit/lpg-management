import {OrganisationalUnitFactory} from "../model/organisationalUnitFactory"
import {Csrs} from "../index"

export class OrganisationalService{

	csrs: Csrs
	organisationalUnitFactory: OrganisationalUnitFactory

	constructor(csrs: Csrs, organisationalUnitFactory: OrganisationalUnitFactory) {
		this.csrs = csrs
		this.organisationalUnitFactory = organisationalUnitFactory
	}

	async getOrganisationalUnit(uri: string){
		const resource = await this.csrs.getOrganisationalUnit(uri)

		const parent = await this.csrs.getOrganisationalUnit(`${resource.id}/parent`)

		const data = {
			id: resource.id,
			name: resource.name,
			code: resource.code,
			abbreviation: resource.abbreviation,
			parent: parent
		}

		return this.organisationalUnitFactory.create(data)
	}
}