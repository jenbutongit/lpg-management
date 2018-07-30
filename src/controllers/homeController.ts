import {NextFunction, Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'
import {CourseRequest} from '../extended'
import * as log4js from 'log4js'
import {CourseFactory} from '../learning-catalogue/model/factory/courseFactory'
import {CourseValidator} from '../learning-catalogue/validator/courseValidator'

export class HomeController {
	logger = log4js.getLogger('controllers/homeController')

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
			const pageResults: DefaultPageResults<Course> = await self.learningCatalogue.listAll(page, size)

			response.render('page/index', {
				pageResults,
				lpgUiUrl: this.lpgUiUrl,
			})
		}
	}

	public getCourse() {
		return async (request: Request, response: Response) => {
			this.logger.debug('Getting course title')

			response.render('page/add-course-title')
		}
	}

	public setCourseTitle() {
		return async (request: Request, response: Response) => {
			const title = request.body.title

			this.logger.debug('Title: ' + title)

			const courseValidator = new CourseValidator()
			const errors = await courseValidator.check(request.body, ['title'])
			if (errors.size) {
				for (let key of Object.keys(errors.fields)) {
					let errorsDescription = errors.fields[key]
					console.log(errorsDescription[0])
				}
				return response.render('page/add-course-title', {
					errors: errors,
				})
			}
			response.render('page/add-course-details', {title})
		}
	}

	public getCourseDetails() {
		return async (request: Request, response: Response) => {
			this.logger.debug('Getting course details')

			response.render('page/add-course-details', {})
		}
	}

	public setCourseDetails() {
		const self = this

		return async (
			request: Request,
			response: Response,
			next: NextFunction
		) => {
			const req = request as CourseRequest

			const data = {
				...req.body,
			}

			const courseFactory: CourseFactory = new CourseFactory()
			const course = courseFactory.create(data)

			const courseValidator = new CourseValidator()
			const errors = await courseValidator.check(course)
			if (errors.size) {
				for (let key of Object.keys(errors.fields)) {
					let errorsDescription = errors.fields[key]
					console.log(errorsDescription[0])
				}
				return response.render('page/add-course-details', {
					title: data.title,
					errors: errors,
				})
			}
			await self.learningCatalogue.create(course)

			response.redirect('/content-management')
		}
	}

	public courseOverview() {
		return async (request: Request, response: Response) => {
			const req = request as CourseRequest

			const course = req.course

			response.render(`page/course`, {course})
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
			const course = await self.learningCatalogue.get(courseId)
			if (course) {
				req.course = course
				next()
			} else {
				response.sendStatus(404)
			}
		}
	}
}
