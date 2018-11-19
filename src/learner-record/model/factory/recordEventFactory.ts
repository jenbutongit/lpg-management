import {RecordEvent} from '../recordEvent'

export class RecordEventFactory {
	constructor() {}

	public create(data: any): RecordEvent {
		let recordEvent: RecordEvent = new RecordEvent()
		recordEvent.id = data.id
		recordEvent.uid = data.uid
		recordEvent.status = RecordEvent.Status[data.status.toUpperCase() as keyof typeof RecordEvent.Status]
		recordEvent.availability = data.availability

		return recordEvent
	}
}
