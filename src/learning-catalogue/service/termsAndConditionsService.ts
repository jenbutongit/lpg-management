import {RestService} from './restService'
import {TermsAndConditionsFactory} from '../model/factory/termsAndConditionsFactory'
import {TermsAndConditions} from '../model/termsAndConditions'

export class TermsAndConditionsService {
	private _restService: RestService
	private _termsAndConditionsFactory: TermsAndConditionsFactory

	constructor(restService: RestService) {
		this._restService = restService
		this._termsAndConditionsFactory = new TermsAndConditionsFactory()
	}

	async create(learningProviderId: string, termsAndConditions: TermsAndConditions): Promise<TermsAndConditions> {
		const data = await this._restService.post(
			`/learning-providers/${learningProviderId}/terms-and-conditions`,
			termsAndConditions
		)
		return this._termsAndConditionsFactory.create(data)
	}

	async get(learningProviderId: string, termsAndConditionsId: string): Promise<TermsAndConditions> {
		const data = this._restService.get(
			`/learning-providers/${learningProviderId}/terms-and-conditions/${termsAndConditionsId}`
		)

		return this._termsAndConditionsFactory.create(data)
	}

	set termsAndConditionsFactory(value: TermsAndConditionsFactory) {
		this._termsAndConditionsFactory = value
	}
}
