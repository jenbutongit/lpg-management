import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Booking} from './model/booking'
import {BookingFactory} from './model/factory/bookingFactory'
import {RecordEventFactory} from './model/factory/recordEventFactory'

export class LearnerRecord {
	private _restService: OauthRestService
	private _bookingFactory: BookingFactory
	private _recordEventFactory: RecordEventFactory

	constructor(
		config: LearnerRecordConfig,
		auth: Auth,
		bookingFactory: BookingFactory,
		recordEventFactory: RecordEventFactory
	) {
		this._restService = new OauthRestService(config, auth)
		this._bookingFactory = bookingFactory
		this._recordEventFactory = recordEventFactory
	}

	async createTestBooking(eventId: string) {
		let data = {
			id: null,
			learner: 'test-id',
			learnerEmail: 'test@test.com',
			event:
				'http://localhost:9001/courses/uh9jCzkhR5Wnlf7Br4Q2iQ/modules/HV68AKO8R6-L0lg6QFVEow/events/CsrUCsx0SIqVMHfMSMbWFg',
			status: 'Requested',
			bookingTime: Date.now(),
			paymentDetails: 'test/payment/details',
		}

		const response = await this._restService.post(`/event/${eventId}/booking/`, data)

		return response
	}

	async getEventBookings(eventId: string) {
		await this.createTestBooking(eventId)
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
			await this._restService.patch(`/event/${eventId}/booking/${booking.id}`, {status: booking.status})
		} catch (e) {
			throw new Error(`An error occurred when trying to update booking: ${e}`)
		}
	}

	async getEvent(eventId: string) {
		try {
			const data = (await this._restService.get(`/event/${eventId}`)).data
			return this._recordEventFactory.create(data)
		} catch (e) {
			throw new Error(`An error occured when trying to get event: ${e}`)
		}
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
