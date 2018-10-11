import {EventRecord} from '../EventRecord'

export class EventRecordFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		let eventRecord: EventRecord = new EventRecord()

		eventRecord.bookingReference = data.bookingReference
		eventRecord.courseId = data.courseId
		eventRecord.delegateEmailAddress = data.delegateEmailAddress
		eventRecord.eventId = data.eventId
		eventRecord.moduleId = data.moduleId
		eventRecord.paymentDetails = data.paymentDetails
		eventRecord.paymentMethod = data.paymentMethod
		eventRecord.status = EventRecord.Status[data.status as keyof typeof EventRecord.Status]

		return eventRecord
	}
}
