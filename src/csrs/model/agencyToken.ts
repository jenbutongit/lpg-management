import { AgencyDomain } from './agencyDomain'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class AgencyToken {
	id: string

	token: string

	@IsNotEmpty({
		groups: ['all', 'capacity'],
		message: 'agencyToken.validation.capacity.invalid'
	})
	@IsNumberString({
		groups: ['all', 'capacity'],
		message: 'agencyToken.validation.capacity.invalid'
	})
	capacity: number

	capacityUsed: number

	agencyDomains: AgencyDomain[]
}
