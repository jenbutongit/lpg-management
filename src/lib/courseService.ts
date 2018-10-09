import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {Event} from '../learning-catalogue/model/event'
import {Module} from '../learning-catalogue/model/module'
import {NextFunction, Request, Response} from 'express'
import {FaceToFaceModule} from '../learning-catalogue/model/faceToFaceModule'

export class CourseService {
	learningCatalogue: LearningCatalogue

	constructor(learningCatalogue: LearningCatalogue) {
		this.learningCatalogue = learningCatalogue
	}

	async sortModules(courseId: string, moduleIds: string[]): Promise<Course> {
		const course: Course = await this.learningCatalogue.getCourse(courseId)

		if (course.modules.length !== moduleIds.length) {
			throw new Error(
				`Course modules length(${course.modules.length}) does not match module ids length(${moduleIds.length})`
			)
		}

		let modules: Module[] = []

		moduleIds.forEach(id => {
			const module: Module | undefined = course.modules.find(m => {
				return m.id === id
			})

			if (module) {
				modules.push(module)
			} else {
				throw new Error(`Module (id: ${id}) not found in course (id: ${courseId})`)
			}
		})

		course.modules = modules

		return await this.learningCatalogue.updateCourse(course)
	}

	/* istanbul ignore next */
	findCourseByCourseIdAndAssignToResponseLocalsOrReturn404() {
		return async (req: Request, res: Response, next: NextFunction, courseId: string) => {
			const course = await this.learningCatalogue.getCourse(courseId)
			if (course) {
				res.locals.course = course
				next()
			} else {
				res.sendStatus(404)
			}
		}
	}

	getAllEventsOnCourse(course: Course): Event[] {
		return course.modules
			.filter((module: Module) => module.type == Module.Type.FACE_TO_FACE)
			.filter((module: Module) => (<FaceToFaceModule>module).events)
			.reduce((arr: Event[], module: Module) => arr.concat((<FaceToFaceModule>module).events), [])
	}
}
