import {AxiosInstance} from 'axios'
import {LearningCatalogueConfig} from '../learningCatalogueConfig'
import {DefaultPageResults} from '../model/defaultPageResults'
import {LearningProvider} from '../model/learningProvider'
import {RestService} from '../service/restService'
import {LearningProviderService} from '../service/learningProviderService'

export class LearningProviderCatalogue {
	private _learningProviderService: LearningProviderService
	private _restService: RestService

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this._restService = new RestService(config)
		this._learningProviderService = new LearningProviderService(
			this._restService
		)
	}

	async listLearningProviders(
		page: number = 0,
		size: number = 10
	): Promise<DefaultPageResults<LearningProvider>> {
		return await this._learningProviderService.listAll(page, size)
	}

	async createLearningProvider(
		learningProvider: LearningProvider
	): Promise<LearningProvider> {
		return this._learningProviderService.create(learningProvider)
	}

	async getLearningProvider(
		learningProviderId: string
	): Promise<LearningProvider> {
		return this._learningProviderService.get(learningProviderId)
	}
}
