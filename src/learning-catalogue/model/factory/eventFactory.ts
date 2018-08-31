import {Event} from '../event'

export class EventFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const event: Event = new Event()

		event.id = data.id

		if (data['start-date-Year'] && data['start-date-Month'] && data['start-date-Day']) {
			event.dateRanges = [{date: '', startTime: '', endTime: ''}]

			event.dateRanges[0].date = (
				data['start-date-Year'] +
				'-' +
				data['start-date-Month'] +
				'-' +
				data['start-date-Day']
			).toString()

			event.dateRanges[0].startTime = (data['start-time'][0] + ':' + data['start-time'][1] + ':00').toString()
			event.dateRanges[0].endTime = (data['end-time'][0] + ':' + data['end-time'][1] + ':00').toString()
		}

		event.location = data.location
		event.capacity = data.capacity

		return event
	}
}
