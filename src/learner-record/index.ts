import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Invite} from './model/invite'
import {InviteFactory} from './model/factory/inviteFactory'

export class LearnerRecord {
	private _restService: OauthRestService
	private _inviteFactory: InviteFactory

	constructor(config: LearnerRecordConfig, auth: Auth, inviteFactory: InviteFactory) {
		this._restService = new OauthRestService(config, auth)

		this._inviteFactory = inviteFactory
	}

	async getEventInvitees(eventId: string) {
		const data = await this._restService.get(`/event/${eventId}/invitee`)

		const invites = (data || []).map(this._inviteFactory.create)
		return invites
	}

	async inviteLearner(eventId: string, invite: Invite) {
		return await this._restService.post(`/event/${eventId}/invitee`, invite)
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
