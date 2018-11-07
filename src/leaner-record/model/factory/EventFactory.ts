import {Event} from '../event'

export class LearnerRecordEventFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any) {
		let event: Event = new Event()

		event.id = data.id
		event.eventUid = data.eventUid
		event.path = data.path

		return event
	}
}
