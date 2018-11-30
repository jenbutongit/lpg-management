import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Booking} from './model/booking'
import {BookingFactory} from './model/factory/bookingFactory'

export class LearnerRecord {
	private _restService: OauthRestService
	private _bookingFactory: BookingFactory

	constructor(config: LearnerRecordConfig, auth: Auth, bookingFactory: BookingFactory) {
		this._restService = new OauthRestService(config, auth)
		this._bookingFactory = bookingFactory
	}

	async getEventBookings(eventId: string) {
		try {
			const data = await this._restService.get(`/event/${eventId}/booking`)
			const bookings = (data || []).map(this._bookingFactory.create)

			return bookings
		} catch (e) {
			throw new Error(`An error occurred when trying to get event bookings: ${e}`)
		}
	}

	async updateBooking(eventId: string, booking: Booking) {
		try {
			await this._restService.patch(`/event/${eventId}/booking/${booking.id}`, {
				status: booking.status,
				cancellationReason: booking.cancellationReason,
			})
		} catch (e) {
			throw new Error(`An error occurred when trying to update booking: ${e}`)
		}
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
