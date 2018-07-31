import {AxiosInstance} from 'axios'
import {Course} from './model/course'
import {LearningCatalogueConfig} from './learningCatalogueConfig'
import {DefaultPageResults} from './model/defaultPageResults'
import {CourseService} from './service/courseService'
import {ModuleService} from './service/moduleService'
import {Module} from './model/module'

export class LearningCatalogue {
	private _courseService: CourseService
	private _moduleService: ModuleService

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this._courseService = new CourseService(http, config)
		this._moduleService = new ModuleService(http, config)
	}

	async listCourses(
		page: number = 0,
		size: number = 10
	): Promise<DefaultPageResults<Course>> {
		return await this._courseService.listAll()
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

	set courseService(value: CourseService) {
		this._courseService = value
	}

	set moduleService(value: ModuleService) {
		this._moduleService = value
	}
}
