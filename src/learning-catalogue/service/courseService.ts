import {LearningCatalogue} from '../index'
import {NextFunction, Request, Response} from 'express'

export class CourseService {
	private learningCatalogue: LearningCatalogue

	constructor(learningCatalogue: LearningCatalogue) {
		this.learningCatalogue = learningCatalogue
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
}