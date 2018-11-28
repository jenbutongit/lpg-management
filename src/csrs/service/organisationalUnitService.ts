import {HalService} from "lib/halService"
import {OrganisationalUnit} from "../model/organisationalUnit"
import {OrganisationalUnitFactory} from "../model/organisationalUnitFactory"
import {HalResource} from "hal-rest-client"

export class OrganisationalUnitService{

	halService: HalService
	organisationalUnitFactory: OrganisationalUnitFactory

	constructor(halService: HalService, organisationalUnitFactory: OrganisationalUnitFactory) {
		this.halService = halService
		this.organisationalUnitFactory = organisationalUnitFactory
	}

	async getOrganisationalUnit(uri: String){
		const resource = await this.halService.getResource(uri)
		const parent = await this.getParentFromResource(resource)

		const orgUnit = resource.props
		const data = {
			id: orgUnit.id,
			name: orgUnit.name,
			code: orgUnit.code,
			abbreviation: orgUnit.abbreviation,
			paymentMethods: orgUnit.paymentMethods,
			subOrgs: orgUnit.subOrgs,
			links: resource.links,
			parent: parent
		}

		const organisationalUnit: OrganisationalUnit = this.organisationalUnitFactory.create(data)

		return organisationalUnit
	}

	async getParentFromResource(resource: HalResource){
		let parent
		const parentResource = await this.halService.getLink(resource, "parent")

		if(parentResource){
			parent = this.organisationalUnitFactory.create(parentResource.props)
		}

		return parent
	}
}