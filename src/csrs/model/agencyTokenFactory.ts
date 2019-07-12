import {AgencyToken} from './agencyToken'
import {AgencyDomainFactory} from './agencyDomainFactory'

export class AgencyTokenFactory {
	private _agencyDomainFactory: AgencyDomainFactory

	constructor(agencyDomainFactory = new AgencyDomainFactory()) {
		this._agencyDomainFactory = agencyDomainFactory
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const agencyToken: AgencyToken = new AgencyToken()

		agencyToken.id = data.id
		agencyToken.token = data.token
		agencyToken.capacity = data.capacity
		agencyToken.agencyDomains = (data.agencyDomains || []).map(this._agencyDomainFactory.create)

		return agencyToken
	}
}
