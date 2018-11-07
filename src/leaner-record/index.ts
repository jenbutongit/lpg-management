import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Booking} from './model/Booking'
import {BookingFactory} from './model/factory/BookingFactory'

export class LearnerRecord {
	private _restService: OauthRestService
	private _bookingFactory: BookingFactory

	constructor(config: LearnerRecordConfig, auth: Auth, bookingFactory: BookingFactory) {
		this._restService = new OauthRestService(config, auth)
		this._bookingFactory = bookingFactory
	}

	async getEventBookings(eventId: string) {
		const data = await this._restService.get(`/events/${eventId}/booking`)

		let bookings = []
		for (const booking of data) {
			bookings.push(this._bookingFactory.create(booking))
		}

		return bookings
	}

	async updateBooking(eventId: string, booking: Booking) {}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
