import {AxiosInstance} from 'axios'
import {Course} from './model/course'
import {CourseFactory} from './model/factory/courseFactory'
import {PageResults} from './model/PageResults'
import {LearningCatalogueConfig} from './learningCatalogueConfig'

export class LearningCatalogue {
	private _http: AxiosInstance
	private _config: LearningCatalogueConfig
	private _courseFactory: CourseFactory

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this._http = http
		this._config = config
		this._courseFactory = new CourseFactory()
	}

	async listAll(): Promise<PageResults<Course>> {
		try {
			const response = await this._http.get(`${this._config.url}/courses`, {
				auth: {
					username: this._config.username,
					password: this._config.password,
				},
			})

			response.data.results = (response.data.results || []).map(
				this._courseFactory.create
			)

			return response.data as PageResults<Course>
		} catch (e) {
			throw new Error(`Error listing all courses - ${e}`)
		}
	}

	get http(): AxiosInstance {
		return this._http
	}

	set http(value: AxiosInstance) {
		this._http = value
	}

	get config(): LearningCatalogueConfig {
		return this._config
	}

	set config(value: LearningCatalogueConfig) {
		this._config = value
	}

	get courseFactory(): CourseFactory {
		return this._courseFactory
	}

	set courseFactory(value: CourseFactory) {
		this._courseFactory = value
	}
}
