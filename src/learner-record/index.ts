import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Invite} from './model/invite'
import {InviteFactory} from './model/factory/inviteFactory'
import {Booking} from './model/booking'
import {BookingFactory} from './model/factory/bookingFactory'

export class LearnerRecord {
	private _restService: OauthRestService
	private _inviteFactory: InviteFactory
	private _bookingFactory: BookingFactory

	constructor(config: LearnerRecordConfig, auth: Auth, bookingFactory: BookingFactory, inviteFactory: InviteFactory) {
		this._restService = new OauthRestService(config, auth)

		this._bookingFactory = bookingFactory
		this._inviteFactory = inviteFactory
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
			await this._restService.patch(`/event/${eventId}/booking/${booking.id}`, {status: booking.status})
		} catch (e) {
			throw new Error(`An error occurred when trying to update booking: ${e}`)
		}
	}

	async getEventInvitees(eventId: string) {
		try {
			const data = await this._restService.get(`/event/${eventId}/invitee`)

			const invites = (data || []).map(this._inviteFactory.create)
			return invites
		} catch (e) {
			throw new Error(`An error occurred when trying to get event invitees: ${e}`)
		}
	}

	async inviteLearner(eventId: string, invite: Invite) {
		try {
			return await this._restService.post(`/event/${eventId}/invitee`, invite)
		} catch (e) {
			return null
		}
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
