import {EventRecord} from '../EventRecord'

export class EventRecordFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		let eventRecord: EventRecord = new EventRecord()

		eventRecord.bookingReference = data.bookingReference
		eventRecord.courseId = data.courseId
		eventRecord.courseName = data.courseName
		eventRecord.delegateEmailAddress = data.delegateEmailAddress
		eventRecord.eventDate = data.eventDate
		eventRecord.eventId = data.eventId
		eventRecord.moduleId = data.moduleId
		eventRecord.moduleName = data.moduleName
		eventRecord.paymentDetails = data.paymentDetails
		eventRecord.paymentMethod = data.paymentMethod
		eventRecord.status = EventRecord.Status[data.status as keyof typeof EventRecord.Status]

		return eventRecord
	}
}
