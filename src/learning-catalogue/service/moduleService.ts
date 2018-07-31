import {Module} from '../model/module'
import {AxiosInstance, AxiosResponse} from 'axios'
import {LearningCatalogueConfig} from '../learningCatalogueConfig'
import {ModuleFactory} from '../model/factory/moduleFactory'
import {EventFactory} from '../model/factory/eventFactory'
import {AudienceFactory} from '../model/factory/audienceFactory'

export class ModuleService {
	private _http: AxiosInstance
	private _config: LearningCatalogueConfig
	private _moduleFactory: ModuleFactory

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this._http = http
		this._config = config
		this._moduleFactory = new ModuleFactory(
			new AudienceFactory(),
			new EventFactory()
		)
	}

	async create(courseId: string, module: Module): Promise<Module> {
		try {
			const response: AxiosResponse = await this._http.post(
				`${this._config.url}/courses/${courseId}/modules`,
				module,
				{
					auth: {
						username: this._config.username,
						password: this._config.password,
					},
				}
			)

			const location = response.headers.location
			const moduleId = location.substr(location.lastIndexOf('/') + 1)

			return this.get(courseId, moduleId)
		} catch (e) {
			throw new Error(`Error creating course: ${e}`)
		}
	}

	async get(courseId: string, moduleId: string): Promise<Module> {
		try {
			const response = await this._http.get(
				`${this._config.url}/courses/${courseId}/modules/${moduleId}`,
				{
					auth: {
						username: this._config.username,
						password: this._config.password,
					},
				}
			)

			return this._moduleFactory.create(response.data)
		} catch (e) {
			throw new Error(
				`Error retrieving module (${moduleId}) of course: ${courseId}: ${e}`
			)
		}
	}

	set moduleFactory(value: ModuleFactory) {
		this._moduleFactory = value
	}
}
