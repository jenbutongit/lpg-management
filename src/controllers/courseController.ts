import {Request, Response, Router} from 'express'
import {CourseValidator} from '../learning-catalogue/validator/courseValidator'
import {ContentRequest} from '../extended'
import {CourseFactory} from '../learning-catalogue/model/factory/courseFactory'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../learning-catalogue'

const logger = log4js.getLogger('controllers/courseController')

export class CourseController {
	learningCatalogue: LearningCatalogue
	courseValidator: CourseValidator
	courseFactory: CourseFactory
	router: Router

	constructor(learningCatalogue: LearningCatalogue, courseValidator: CourseValidator, courseFactory: CourseFactory) {
		this.learningCatalogue = learningCatalogue
		this.courseValidator = courseValidator
		this.courseFactory = courseFactory
		this.router = Router()

		this.setRouterPaths()
	}

	private setRouterPaths() {
		this.router.param('courseId', async (ireq, res, next, courseId) => {
			const req = ireq as ContentRequest

			const course = await this.learningCatalogue.getCourse(courseId)

			if (course) {
				req.course = course
			} else {
				res.sendStatus(404)
			}
			next()
		})

		this.router.get('/content-management/course/:courseId', this.courseOverview())

		this.router.get('/content-management/add-course', this.getCourseTitle())
		this.router.post('/content-management/add-course', this.setCourseTitle())
		this.router.get('/content-management/add-course-details', this.getCourseDetails())
		this.router.post('/content-management/add-course-details', this.setCourseDetails())

		this.router.get('/content-management/course-preview/:courseId', this.coursePreview())
	}

	public courseOverview() {
		logger.debug('Course Overview page')

		return async (request: Request, response: Response) => {
			const req = request as ContentRequest
			const course = req.course

			response.render(`page/course`, {course: course})
		}
	}

	public coursePreview() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest
			const course = req.course

			response.render(`page/course-preview`, {course: course})
		}
	}

	public getCourseTitle() {
		return async (request: Request, response: Response) => {
			response.render('page/add-course-title')
		}
	}

	public setCourseTitle() {
		return async (request: Request, response: Response) => {
			const errors = await this.courseValidator.check(request.body, ['title'])

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors}
				return response.redirect('/content-management/add-course')
			}

			const title = request.body.title
			request.session!.sessionFlash = {title: title}

			return response.redirect('/content-management/add-course-details')
		}
	}

	public getCourseDetails() {
		return async (request: Request, response: Response) => {
			response.render('page/add-course-details')
		}
	}

	public setCourseDetails() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest

			const data = {
				...req.body,
			}

			const course = this.courseFactory.create(data)

			const errors = await this.courseValidator.check(course)

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, title: data.title, course: course}
				return response.redirect('/content-management/add-course-details')
			}
			await this.learningCatalogue.createCourse(course)

			return response.redirect('/content-management')
		}
	}
}
