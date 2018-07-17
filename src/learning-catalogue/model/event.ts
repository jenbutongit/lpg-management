import moment = require('moment')

export class Event {
	private _id: string
	private _date: Date
	private _location: string
	private _capacity: number

	get id(): string {
		return this._id
	}

	set id(value: string) {
		this._id = value
	}

	get date(): Date {
		return this._date
	}

	set date(value: Date) {
		this._date = moment.utc(value).toDate()
	}

	get location(): string {
		return this._location
	}

	set location(value: string) {
		this._location = value
	}

	get capacity(): number {
		return this._capacity
	}

	set capacity(value: number) {
		this._capacity = value
	}
}
