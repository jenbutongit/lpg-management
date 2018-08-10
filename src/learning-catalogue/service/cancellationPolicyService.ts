import {DefaultPageResults} from '../model/defaultPageResults'
import {RestService} from './restService'
import {CancellationPolicyFactory} from '../model/factory/cancellationPolicyFactory'
import {CancellationPolicy} from '../model/cancellationPolicy'

export class CancellationPolicyService {
	private _restService: RestService
	private _cancellationPolicyFactory: CancellationPolicyFactory

	constructor(restService: RestService) {
		this._restService = restService
		this._cancellationPolicyFactory = new CancellationPolicyFactory()
	}

	async listAll(page: number = 0, size: number = 10): Promise<DefaultPageResults<CancellationPolicy>> {
		const data = await this._restService.get(`/learning-provider/list?page=${page}&size=${size}`)

		data.results = (data.results || []).map(this._cancellationPolicyFactory.create)

		// prettier-ignore
		const coursePageResults: DefaultPageResults<CancellationPolicy> = new DefaultPageResults()

		coursePageResults.size = data.size
		coursePageResults.results = data.results
		coursePageResults.page = data.page
		coursePageResults.totalResults = data.totalResults

		return coursePageResults
	}

	async create(cancellationPolicy: CancellationPolicy): Promise<CancellationPolicy> {
		const data = await this._restService.post('/learning-provider/', cancellationPolicy)
		return this._cancellationPolicyFactory.create(data)
	}

	async get(cancellationPolicyId: string): Promise<CancellationPolicy> {
		const data = this._restService.get(`/learning-provider/${cancellationPolicyId}`)

		return this._cancellationPolicyFactory.create(data)
	}

	set cancellationPolicyFactory(value: CancellationPolicyFactory) {
		this._cancellationPolicyFactory = value
	}
}
