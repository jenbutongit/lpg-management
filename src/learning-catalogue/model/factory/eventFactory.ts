import {Event} from '../event'

export class EventFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const event: Event = new Event()

		event.id = data.id

		event.dateRanges = [{date: '', startTime: '', endTime: ''}]

		if (data.startTime) {
			event.dateRanges[0].date = (
				data['start-date-Year'] +
				'-' +
				data['start-date-Month'] +
				'-' +
				data['start-date-Day']
			).toString()

			event.dateRanges[0].startTime = (data['start-time'][0] + ':' + data['start-time'][1] + ':00').toString()

			event.startTimes = event.dateRanges[0].date
		}
		if (data.endTime) {
			event.dateRanges[0].endTime = (data['end-time'][0] + ':' + data['end-time'][1] + ':00').toString()

			event.endTimes = event.dateRanges[0].date
		}

		// console.log(event.dateRanges)

		//event.dateRanges = [{date: '2019-03-03', startTime: '06:00:00', endTime: '09:00:00'}]
		//					 [{date: '2019-03-03', startTime: '06:00:00', endTime: '09:00:00'}]

		console.log(event.dateRanges)

		event.location = data.location
		event.capacity = data.capacity

		return event
	}
}
