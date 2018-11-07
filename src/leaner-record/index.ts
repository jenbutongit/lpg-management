import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Booking} from './model/Booking'
import {BookingFactory} from './model/factory/BookingFactory'
import {Learner} from './model/Learner'

export class LearnerRecord {
	private _restService: OauthRestService
	private _bookingFactory: BookingFactory

	constructor(config: LearnerRecordConfig, auth: Auth, bookingFactory: BookingFactory) {
		this._restService = new OauthRestService(config, auth)
		this._bookingFactory = bookingFactory
	}

	async createTestBooking(eventId: string) {
		let learner: Learner = new Learner()
		learner.uid = 'test-id'
		learner.learnerEmail = 'test@test.com'

		let data = {
			id: null,
			learner: learner.uid,
			learnerEmail: learner.learnerEmail,
			event:
				'http://localhost:9001/course/uh9jCzkhR5Wnlf7Br4Q2iQ/module/HV68AKO8R6-L0lg6QFVEow/event/CsrUCsx0SIqVMHfMSMbWFg',
			status: 'Requested',
			bookingTime: Date.now(),
			paymentDetails: 'test/payment/details',
		}

		const response = await this._restService.post(`/event/${eventId}/booking/`, data)

		return response
	}

	async getEventBookings(eventId: string) {
		//await this.createTestBooking(eventId)

		const data = await this._restService.get(`/event/${eventId}/booking`)

		let bookings = []
		for (const booking of data) {
			bookings.push(this._bookingFactory.create(booking))
		}

		return bookings
	}

	async updateBooking(eventId: string, booking: Booking) {
		await this._restService.patch(`/event/${eventId}/booking/${booking.id}`, booking.status)
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
