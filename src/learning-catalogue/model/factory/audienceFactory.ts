import {Audience} from '../audience'
import * as moment from 'moment'

export class AudienceFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const audience: Audience = new Audience()
		audience.name = data.name
		audience.areasOfWork = data.areasOfWork
		audience.departments = data.departments
		audience.grades = data.grades
		audience.interests = data.interests
		if (data.requiredBy) {
			audience.requiredBy = moment.utc(data.requiredBy).toDate()
		}
		audience.mandatory = data.mandatory
		audience.frequency = data.frequency

		return audience
	}
}
