import {NextFunction, Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'
import {CourseRequest} from '../extended'

export class HomeController {
	learningCatalogue: LearningCatalogue
	lpgUiUrl: String

	constructor(learningCatalogue: LearningCatalogue, lpgUiUrl: String) {
		this.learningCatalogue = learningCatalogue
		this.lpgUiUrl = lpgUiUrl
	}

	public index() {
		const self = this
		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			let page = 0
			let size = 10

			if (request.query.p) {
				page = request.query.p
			}
			if (request.query.s) {
				size = request.query.s
			}

			// prettier-ignore
			const pageResults: DefaultPageResults<Course> = await self.learningCatalogue.listCourses(page, size)

			response.render('page/index', {
				pageResults,
				lpgUiUrl: this.lpgUiUrl,
			})
		}
	}

	public courseOverview() {
		return async (request: Request, response: Response) => {
			const req = request as CourseRequest

			const course = req.course

			response.render(`page/course`, {course})
		}
	}

	public addModule() {
		return async (request: Request, response: Response) => {
			response.render(`page/add-module`)
		}
	}

	public addModuleBlog() {
		return async (request: Request, response: Response) => {
			response.render(`page/add-module-blog`)
		}
	}

	public loadCourse() {
		const self = this

		return async (
			request: Request,
			response: Response,
			next: NextFunction
		) => {
			const req = request as CourseRequest
			const courseId: string = req.params.courseId
			const course = await self.learningCatalogue.getCourse(courseId)
			if (course) {
				req.course = course
				next()
			} else {
				response.sendStatus(404)
			}
		}
	}
}
