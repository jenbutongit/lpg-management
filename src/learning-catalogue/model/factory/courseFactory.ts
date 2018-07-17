import {Course} from '../course'
import {ModuleFactory} from './moduleFactory'

export class CourseFactory {
	moduleFactory: ModuleFactory

	constructor(moduleFactory: ModuleFactory) {
		this.moduleFactory = moduleFactory
	}

	create(data: any) {
		const course: Course = new Course()

		course.id = data.id
		course.description = data.description
		course.learningOutcomes = data.learningOutcomes
		course.shortDescription = data.shortDescription
		course.title = data.title
		course.modules = (data.modules || []).map(this.moduleFactory.create)

		return course
	}
}
