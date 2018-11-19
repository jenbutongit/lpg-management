export class RecordEvent {
	id: number
	uid: string
	status: RecordEvent.Status
	availability: number
}

export namespace RecordEvent {
	export enum Status {
		ACTIVE = 'Active',
		CANCELLED = 'Cancelled',
	}
}
