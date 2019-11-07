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
		agencyToken.token = data.tokenNumber
		agencyToken.capacity = data.capacity
		agencyToken.capacityUsed = data.capacityUsed ? data.capacityUsed : 0
		agencyToken.agencyDomains = (data.domains || []).map(this._agencyDomainFactory.create)

		return agencyToken
	}
}
