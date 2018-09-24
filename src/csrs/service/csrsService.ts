import {OauthRestService} from '../../lib/http/oauthRestService'

export class CsrsService {
	restService: OauthRestService

	constructor(restService: OauthRestService) {
		this.restService = restService
	}

	async getOrganisations() {
		return await this.restService.get('organisations')
	}
}
