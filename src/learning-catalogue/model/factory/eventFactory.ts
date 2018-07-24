import {Event} from '../event'
import * as moment from 'moment'

export class EventFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const event: Event = new Event()

		event.id = data.id

		if (data.date) {
			event.date = moment.utc(data.date).toDate()
		}
		event.location = data.location
		event.capacity = data.capacity

		return event
	}
}
