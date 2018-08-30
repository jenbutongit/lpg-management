import {Event} from '../event'
import * as moment from 'moment'

export class EventFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const event: Event = new Event()

		event.id = data.id

		if (data.startTime) {
			event.startTimes.push(moment.utc(data.startTime).toDate())
		}
		if (data.endTime) {
			event.endTimes.push(moment.utc(data.endTime).toDate())
		}

		event.location = data.location
		event.capacity = data.capacity

		return event
	}
}
