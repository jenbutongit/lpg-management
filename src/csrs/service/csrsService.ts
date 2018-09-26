import {OauthRestService} from '../../lib/http/oauthRestService'

export class CsrsService {
	restService: OauthRestService

	constructor(restService: OauthRestService) {
		this.restService = restService
	}

	async getOrganisations() {
		return await this.restService.get('organisations')
	}

	async getAreasOfWork() {
		return await this.restService.get('professions')
	}

	async getGrades() {
		return await this.restService.get('grades')
	}

	async getInterests() {
		return await this.restService.get('interests')
	}
}
