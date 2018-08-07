import {AxiosInstance} from 'axios'
import {LearningCatalogueConfig} from '../learningCatalogueConfig'
import {LearningProviderFactory} from '../model/factory/learningProviderFactory'
import {DefaultPageResults} from '../model/defaultPageResults'
import {LearningProvider} from '../../../dist/build/src/learning-catalogue/model/learningProvider'

export class LearningProviderCatalogue {
	private _http: AxiosInstance
	private _config: LearningCatalogueConfig
	private _learningProviderFactory: LearningProviderFactory

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this._http = http
		this._config = config
		this._learningProviderFactory = new LearningProviderFactory()
	}

	async listAll(
		page: number = 0,
		size: number = 10
	): Promise<DefaultPageResults<LearningProvider>> {
		try {
			const response = await this._http.get(
				`${
					this._config.url
				}/learning-provider/list?page=${page}&size=${size}`,
				{
					auth: {
						username: this._config.username,
						password: this._config.password,
					},
				}
			)

			response.data.results = (response.data.results || []).map(
				this._learningProviderFactory.create
			)

			// prettier-ignore
			const learningProviderPageResults: DefaultPageResults<LearningProvider> = new DefaultPageResults()

			learningProviderPageResults.size = size
			learningProviderPageResults.results = response.data.results
			learningProviderPageResults.page = page
			learningProviderPageResults.totalResults =
				response.data.totalResults

			return learningProviderPageResults
		} catch (e) {
			throw new Error(`Error listing all learning providers - ${e}`)
		}
	}

	async create(
		learningProvider: LearningProvider
	): Promise<LearningProvider> {
		try {
			const response = await this._http.post(
				`${this._config.url}/learning-provider`,
				learningProvider,
				{
					auth: {
						username: this._config.username,
						password: this._config.password,
					},
				}
			)

			const location = response.headers.location
			const learningProviderId = location.substr(
				location.lastIndexOf('/') + 1
			)

			return this.get(learningProviderId)
		} catch (e) {
			throw new Error(`Error creating learning provider: ${e}`)
		}
	}

	async get(learningProviderId: string): Promise<LearningProvider> {
		try {
			const response = await this._http.get(
				`${this._config.url}/learning-provider/${learningProviderId}`,
				{
					auth: {
						username: this._config.username,
						password: this._config.password,
					},
				}
			)

			return this._learningProviderFactory.create(response.data)
		} catch (e) {
			throw new Error(`Error retrieving learningProvider: ${e}`)
		}
	}

	set learningProviderFactory(value: LearningProviderFactory) {
		this._learningProviderFactory = value
	}
}
