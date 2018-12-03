import {HalService} from "lib/halService"
import {OrganisationalUnitFactory} from "../model/organisationalUnitFactory"
import {HalResource} from "hal-rest-client"

export class OrganisationalUnitService{

	halService: HalService
	organisationalUnitFactory: OrganisationalUnitFactory

	constructor(halService: HalService, organisationalUnitFactory: OrganisationalUnitFactory) {
		this.halService = halService
		this.organisationalUnitFactory = organisationalUnitFactory
	}

	async getOrganisationalUnit(uri: string){
		const resource = await this.halService.getResource(uri)

		const data: any = await this.getDataFromResource(resource)
		data.parent = await this.getParentFromResource(resource)

		return this.organisationalUnitFactory.create(data)
	}

	async getParentFromResource(resource: HalResource){
		let parent
		const parentResource = await this.halService.getLink(resource, 'parent')
		if (parentResource){
			const data = await this.getDataFromResource(parentResource)

			parent = this.organisationalUnitFactory.create(data)
		}

		return parent
	}

	async getDataFromResource(resource: HalResource){
		const href = await this.getUri(resource)

		const orgUnit: any = resource.props
		const data = {
			id: orgUnit.id,
			name: orgUnit.name,
			code: orgUnit.code,
			abbreviation: orgUnit.abbreviation,
			paymentMethods: orgUnit.paymentMethods,
			subOrgs: orgUnit.subOrgs,
			uri: href
		}

		return data
	}

	async getUri(resource: HalResource){
		return resource.uri.uri
	}
}