import {DefaultPageResults} from '../model/defaultPageResults'
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

	async listAll(page: number = 0, size: number = 10): Promise<DefaultPageResults<TermsAndConditions>> {
		const data = await this._restService.get(`/learning-provider/list?page=${page}&size=${size}`)

		data.results = (data.results || []).map(this._termsAndConditionsFactory.create)

		// prettier-ignore
		const termsAndConditionsPageResults: DefaultPageResults<TermsAndConditions> = new DefaultPageResults()

		termsAndConditionsPageResults.size = data.size
		termsAndConditionsPageResults.results = data.results
		termsAndConditionsPageResults.page = data.page
		termsAndConditionsPageResults.totalResults = data.totalResults

		return termsAndConditionsPageResults
	}

	async create(termsAndConditions: TermsAndConditions): Promise<TermsAndConditions> {
		const data = await this._restService.post('/learning-provider/', termsAndConditions)
		return this._termsAndConditionsFactory.create(data)
	}

	async get(termsAndConditionsId: string): Promise<TermsAndConditions> {
		const data = this._restService.get(`/learning-provider/${termsAndConditionsId}`)

		return this._termsAndConditionsFactory.create(data)
	}

	set termsAndConditionsFactory(value: TermsAndConditionsFactory) {
		this._termsAndConditionsFactory = value
	}
}
