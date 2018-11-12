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
		const data = await this._restService.get(`/event/${eventId}/booking`)
		const bookings = (data || []).map(this._bookingFactory.create)

		return bookings
	}

	async updateBooking(eventId: string, booking: Booking) {
		await this._restService.patch(`/event/${eventId}/booking/${booking.id}`, {status: booking.status})
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
