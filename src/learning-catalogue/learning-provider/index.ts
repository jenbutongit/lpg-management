import {LearningCatalogueConfig} from '../learningCatalogueConfig'
import {DefaultPageResults} from '../model/defaultPageResults'
import {LearningProvider} from '../model/learningProvider'
import {CancellationPolicy} from '../model/cancellationPolicy'
import {RestService} from '../service/restService'
import {LearningProviderService} from '../service/learningProviderService'
import {CancellationPolicyService} from '../service/cancellationPolicyService'

export class LearningProviderCatalogue {
	private _learningProviderService: LearningProviderService
	private _cancellationPolicyService: CancellationPolicyService
	private _restService: RestService

	constructor(config: LearningCatalogueConfig) {
		this._restService = new RestService(config)
		this._cancellationPolicyService = new CancellationPolicyService(
			this._restService
		)
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

	async listCancellationPolicy(
		page: number = 0,
		size: number = 10
	): Promise<DefaultPageResults<CancellationPolicy>> {
		return await this._cancellationPolicyService.listAll(page, size)
	}

	async createCancellationPolicy(
		cancellationPolicy: CancellationPolicy
	): Promise<LearningProvider> {
		return this._cancellationPolicyService.create(cancellationPolicy)
	}
}
