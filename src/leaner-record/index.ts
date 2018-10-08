import {OauthRestService} from '../lib/http/oauthRestService'
import {LearnerRecordConfig} from './learnerRecordConfig'
import {Auth} from '../identity/auth'
import {EventRecordFactory} from './model/factory/EventRecordFactory'

export class LearnerRecord {
	_restService: OauthRestService
	_eventRecordFactory: EventRecordFactory

	constructor(config: LearnerRecordConfig, auth: Auth, eventRecordFactory: EventRecordFactory) {
		this._restService = new OauthRestService(config, auth)

		this._eventRecordFactory = eventRecordFactory
	}

	async getEventRecord(eventId: string) {
		const data = this._restService.get('/events/' + eventId)

		return this._eventRecordFactory.create(data)
	}
}
