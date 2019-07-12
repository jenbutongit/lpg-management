import {AgencyDomain} from './agencyDomain'

export class AgencyToken {
	id: string
	token: string
	capacity: number
	agencyDomains: AgencyDomain[]
}
