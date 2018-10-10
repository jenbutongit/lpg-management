export class EventRecord {
	courseId: string
	moduleId: string
	eventId: string

	bookingReference: string

	delegateEmailAddress: string

	status: EventRecord.Status

	paymentMethod: string
	paymentDetails: string
}

export namespace EventRecord {
	export enum Status {
		APPROVED,
		CANCELLED,
		REQUESTED,
	}
}
