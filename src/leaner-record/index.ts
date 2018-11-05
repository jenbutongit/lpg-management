import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {EventRecordFactory} from './model/factory/eventRecordFactory'
import {Invite} from './model/invite'
import {InviteFactory} from './model/factory/inviteFactory'

export class LearnerRecord {
	private _restService: OauthRestService
	private _eventRecordFactory: EventRecordFactory
	private _inviteFactory: InviteFactory

	constructor(
		config: LearnerRecordConfig,
		auth: Auth,
		eventRecordFactory: EventRecordFactory,
		inviteFactory: InviteFactory
	) {
		this._restService = new OauthRestService(config, auth)

		this._eventRecordFactory = eventRecordFactory

		this._inviteFactory = inviteFactory
	}

	async getEventRecord(eventId: string) {
		const data = await this._restService.get(`/events/${eventId}`)

		let records = []

		for (const record of data) {
			records.push(this._eventRecordFactory.create(record))
		}

		return records
	}

	async getEventInvitees(eventId: string) {
		const data = await this._restService.get(`/event/${eventId}/invitee`)

		let invites = []

		for (const invite of data) {
			invites.push(this._inviteFactory.create(invite))
		}

		return invites
	}

	async inviteLearner(eventId: string, invite: Invite) {
		return await this._restService.post(`/event/${eventId}/invitee`, invite)
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
