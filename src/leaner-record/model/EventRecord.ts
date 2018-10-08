import {DateRange} from '../../learning-catalogue/model/dateRange'

export class EventRecord {
	courseId: string
	moduleId: string
	eventId: string

	courseName: string
	moduleName: string

	bookingReference: string

	delegateEmailAddress: string

	status: EventRecord.Status

	eventDate: DateRange

	paymentMethod: string
	paymentDetails: string
}

export namespace EventRecord {
	export enum Status {
		REGISTERED,
		UNREGISTERED,
	}
}
