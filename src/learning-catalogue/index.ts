import {AxiosInstance} from 'axios'
import {Course} from './model/course'
import {CourseFactory} from './model/factory/courseFactory'
import {PageResults} from './model/PageResults'

export class LearningCatalogue {
	private http: AxiosInstance
	private courseFactory: CourseFactory

	constructor(http: AxiosInstance, courseFactory: CourseFactory) {
		this.http = http
		this.courseFactory = courseFactory
	}

	async listAll(): Promise<PageResults<Course>> {
		try {
			const response = await this.http.get('/courses')

			const results = (response.data.results || []).map(
				this.courseFactory.create
			) as PageResults<Course>

			return results
		} catch (e) {
			throw new Error(`Error listing all courses - ${e}`)
		}
	}
}
