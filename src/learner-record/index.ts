import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {Invite} from './model/invite'
import {InviteFactory} from './model/factory/inviteFactory'
import * as log4js from 'log4js'

export class LearnerRecord {
	private static LOG = log4js.getLogger('learner-record')

	private _restService: OauthRestService
	private _inviteFactory: InviteFactory

	constructor(config: LearnerRecordConfig, auth: Auth, inviteFactory: InviteFactory) {
		this._restService = new OauthRestService(config, auth)

		this._inviteFactory = inviteFactory
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

	async cancelEvent(eventId: string) {
		try {
			return await this._restService.delete(`/event/${eventId}`)
		}
		catch (error) {
			LearnerRecord.LOG.error(`Unable to cancel event: ${error}`)
		}
	}

	set restService(value: OauthRestService) {
		this._restService = value
	}
}
