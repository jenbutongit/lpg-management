import {Course} from './model/course'
import {DefaultPageResults} from './model/defaultPageResults'
import {CourseService} from './service/courseService'
import {ModuleService} from './service/moduleService'
import {Module} from './model/module'
import {RestService} from './service/restService'
import {LearningCatalogueConfig} from './learningCatalogueConfig'
import {LearningProvider} from './model/learningProvider'
import {CancellationPolicy} from './model/cancellationPolicy'
import {TermsAndConditions} from './model/termsAndConditions'
import {EntityService} from './service/entityService'
import {LearningProviderFactory} from './model/factory/learningProviderFactory'
import {CancellationPolicyFactory} from './model/factory/cancellationPolicyFactory'
import {TermsAndConditionsFactory} from './model/factory/termsAndConditionsFactory'

export class LearningCatalogue {
	private _courseService: CourseService
	private _moduleService: ModuleService
	private _learningProviderService: EntityService<LearningProvider>
	private _cancellationPolicyService: EntityService<CancellationPolicy>
	private _termsAndConditionsService: EntityService<TermsAndConditions>
	private _restService: RestService

	constructor(config: LearningCatalogueConfig) {
		this._restService = new RestService(config)
		this._courseService = new CourseService(this._restService)
		this._moduleService = new ModuleService(this._restService)

		this._learningProviderService = new EntityService<LearningProvider>(
			this._restService,
			new LearningProviderFactory()
		)
		this._cancellationPolicyService = new EntityService<CancellationPolicy>(
			this._restService,
			new CancellationPolicyFactory()
		)
		this._termsAndConditionsService = new EntityService<TermsAndConditions>(
			this._restService,
			new TermsAndConditionsFactory()
		)
	}

	async listCourses(page: number = 0, size: number = 10): Promise<DefaultPageResults<Course>> {
		return await this._courseService.listAll(page, size)
	}

	async createCourse(course: Course): Promise<Course> {
		return this._courseService.create(course)
	}

	async getCourse(courseId: string): Promise<Course> {
		return this._courseService.get(courseId)
	}

	async createModule(courseId: string, module: Module): Promise<Module> {
		return this._moduleService.create(courseId, module)
	}

	async getModule(courseId: string, moduleId: string): Promise<Module> {
		return this._moduleService.get(courseId, moduleId)
	}

	async listLearningProviders(page: number = 0, size: number = 10): Promise<DefaultPageResults<LearningProvider>> {
		return await this._learningProviderService.listAll(`/learning-providers?page=${page}&size=${size}`)
	}

	async getLearningProvider(learningProviderId: string): Promise<LearningProvider> {
		return this._learningProviderService.get(`/learning-providers/${learningProviderId}`)
	}

	async createLearningProvider(learningProvider: LearningProvider): Promise<LearningProvider> {
		return this._learningProviderService.create('/learning-providers/', learningProvider)
	}

	async getCancellationPolicy(learningProviderId: string, cancellationPolicyId: string): Promise<CancellationPolicy> {
		return this._cancellationPolicyService.get(
			`/learning-providers/${learningProviderId}/cancellation-policies/${cancellationPolicyId}`
		)
	}

	async createCancellationPolicy(
		learningProviderId: string,
		cancellationPolicy: CancellationPolicy
	): Promise<CancellationPolicy> {
		return this._cancellationPolicyService.create(
			`/learning-providers/${learningProviderId}/cancellation-policies`,
			cancellationPolicy
		)
	}

	async getTermsAndConditions(learningProviderId: string, termsAndConditionsId: string): Promise<TermsAndConditions> {
		return this._termsAndConditionsService.get(
			`/learning-providers/${learningProviderId}/terms-and-conditions/${termsAndConditionsId}`
		)
	}

	async createTermsAndConditions(
		learningProviderId: string,
		termsAndConditions: TermsAndConditions
	): Promise<TermsAndConditions> {
		return this._termsAndConditionsService.create(
			`/learning-providers/${learningProviderId}/terms-and-conditions`,
			termsAndConditions
		)
	}

	set courseService(value: CourseService) {
		this._courseService = value
	}

	set moduleService(value: ModuleService) {
		this._moduleService = value
	}

	set learningProviderService(value: EntityService<LearningProvider>) {
		this._learningProviderService = value
	}

	set cancellationPolicyService(value: EntityService<CancellationPolicy>) {
		this._cancellationPolicyService = value
	}

	set termsAndConditionsService(value: EntityService<TermsAndConditions>) {
		this._termsAndConditionsService = value
	}
}
