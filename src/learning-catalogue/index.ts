import {AxiosInstance} from 'axios'
import {Course} from './model/course'
import {CourseFactory} from './model/factory/courseFactory'
import {LearningCatalogueConfig} from './learningCatalogueConfig'
import {CoursePageResults} from './model/coursePageResults'

export class LearningCatalogue {
	private _http: AxiosInstance
	private _config: LearningCatalogueConfig
	private _courseFactory: CourseFactory

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this._http = http
		this._config = config
		this._courseFactory = new CourseFactory()
	}

	async listAll(
		page: number = 0,
		size: number = 10
	): Promise<CoursePageResults<Course>> {
		try {
			const response = await this._http.get(
				`${this._config.url}/courses?page=${page}&size=${size}`,
				{
					auth: {
						username: this._config.username,
						password: this._config.password,
					},
				}
			)

			response.data.results = (response.data.results || []).map(
				this._courseFactory.create
			)

			const coursePageResults: CoursePageResults<
				Course
			> = new CoursePageResults()
			coursePageResults.size = size
			coursePageResults.results = response.data.results
			coursePageResults.page = page
			coursePageResults.totalResults = 10

			return coursePageResults
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
