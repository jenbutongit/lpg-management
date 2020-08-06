import {AgencyDomain} from './agencyDomain'

export class AgencyDomainFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const agencyDomain: AgencyDomain = new AgencyDomain()

		agencyDomain.domain = data

		return agencyDomain
	}
}
