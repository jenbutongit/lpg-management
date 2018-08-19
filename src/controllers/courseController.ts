import {Request, Response, Router} from 'express'
import {ContentRequest} from '../extended'
import {CourseFactory} from '../learning-catalogue/model/factory/courseFactory'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {Validator} from '../learning-catalogue/validator/validator'

const logger = log4js.getLogger('controllers/courseController')

export class CourseController {
	learningCatalogue: LearningCatalogue
	courseValidator: Validator<Course>
	courseFactory: CourseFactory
	router: Router

	constructor(
		learningCatalogue: LearningCatalogue,
		courseValidator: Validator<Course>,
		courseFactory: CourseFactory
	) {
		this.learningCatalogue = learningCatalogue
		this.courseValidator = courseValidator
		this.courseFactory = courseFactory
		this.router = Router()

		this.setRouterPaths()
	}

	private setRouterPaths() {
		this.router.param('courseId', async (req, res, next, courseId) => {
			const course = await this.learningCatalogue.getCourse(courseId)

			if (course) {
				res.locals.course = course
				next()
			} else {
				res.sendStatus(404)
			}
		})

		this.router.get('/content-management/course/:courseId', this.courseOverview())

		this.router.get('/content-management/add-course/:courseId?', this.getCourseTitle())
		this.router.post('/content-management/add-course/:courseId?', this.setCourseTitle())

		this.router.get('/content-management/add-course-details/:courseId?', this.getCourseDetails())
		this.router.post('/content-management/add-course-details/:courseId?', this.setCourseDetails())

		this.router.get('/content-management/course-preview/:courseId', this.coursePreview())
	}

	public courseOverview() {
		logger.debug('Course Overview page')

		return async (request: Request, response: Response) => {
			response.render('page/course')
		}
	}

	public coursePreview() {
		return async (request: Request, response: Response) => {
			response.render('page/course-preview')
		}
	}

	public getCourseTitle() {
		return async (request: Request, response: Response) => {
			if (request.params.courseId) {
				console.log('editing course title')
			} else {
				console.log('creating new course')
			}
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

			if (request.params.courseId) {
				await this.editCourse(request, response)

				return response.redirect(`/content-management/course-preview/${request.params.courseId}`)
			}

			const course = this.courseFactory.create(request.body)
			request.session!.sessionFlash = {course: course}

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
				request.session!.sessionFlash = {errors: errors, course: course}
				return response.redirect('/content-management/add-course-details')
			}

			if (request.params.courseId) {
				await this.editCourse(request, response)

				return response.redirect(`/content-management/course-preview/${request.params.courseId}`)
			}

			request.session!.sessionFlash = {courseAddedSuccessMessage: 'course_added_success_message'}

			const savedCourse = await this.learningCatalogue.createCourse(course)

			return response.redirect(`/content-management/course/${savedCourse.id}`)
		}
	}

	private async editCourse(request: Request, response: Response) {
		const data = {
			...request.body,
			id: response.locals.course.id,
			title: request.body.title || response.locals.course.title,
			description: request.body.requiredBy || response.locals.course.description,
			shortDescription: request.body.shortDescription || response.locals.course.shortDescription,
			learningOutcomes: request.body.learningOutcomes || response.locals.course.learningOutcomes,
			modules: request.body.modules || response.locals.course.modules,
		}

		const course = this.courseFactory.create(data)

		await this.learningCatalogue.updateCourse(course)
	}
}
