import {Request, Response, Router} from 'express'
// import {ContentRequest} from '../extended'
import {ModuleFactory} from '../learning-catalogue/model/factory/moduleFactory'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../learning-catalogue'
import {Module} from '../learning-catalogue/model/module'
import {Validator} from 'src/learning-catalogue/validator/validator'

const logger = log4js.getLogger('controllers/moduleController')

export class ModuleController {
	learningCatalogue: LearningCatalogue
	moduleValidator: Validator<Module>
	moduleFactory: ModuleFactory
	router: Router

	constructor(
		learningCatalogue: LearningCatalogue,
		moduleValidator: Validator<Module>,
		moduleFactory: ModuleFactory
	) {
		this.learningCatalogue = learningCatalogue
		this.moduleValidator = moduleValidator
		this.moduleFactory = moduleFactory
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

		this.router.get('/content-management/courses/:courseId/modules', this.addModule())

		// this.router.get('/content-management/add-course', this.getCourseTitle())
		// this.router.post('/content-management/add-course', this.setCourseTitle())
		// this.router.get('/content-management/add-course-details', this.getCourseDetails())
		// this.router.post('/content-management/add-course-details', this.setCourseDetails())

		// this.router.get('/content-management/course-preview/:courseId', this.coursePreview())
	}

	public addModule() {
		logger.debug('Add module page')

		return async (request: Request, response: Response) => {
			response.render('page/add-module')
		}
	}

	// public coursePreview() {
	// 	return async (request: Request, response: Response) => {
	// 		response.render('page/course-preview')
	// 	}
	// }

	// public getCourseTitle() {
	// 	return async (request: Request, response: Response) => {
	// 		response.render('page/add-course-title')
	// 	}
	// }

	// public setCourseTitle() {
	// 	return async (request: Request, response: Response) => {
	// 		const errors = await this.courseValidator.check(request.body, ['title'])

	// 		if (errors.size) {
	// 			request.session!.sessionFlash = {errors: errors}
	// 			return response.redirect('/content-management/add-course')
	// 		}

	// 		const title = request.body.title
	// 		request.session!.sessionFlash = {title: title}

	// 		return response.redirect('/content-management/add-course-details')
	// 	}
	// }

	// public getCourseDetails() {
	// 	return async (request: Request, response: Response) => {
	// 		response.render('page/add-course-details')
	// 	}
	// }

	// public setCourseDetails() {
	// 	return async (request: Request, response: Response) => {
	// 		const req = request as ContentRequest

	// 		const data = {
	// 			...req.body,
	// 		}

	// 		const course = this.courseFactory.create(data)

	// 		const errors = await this.courseValidator.check(course)

	// 		if (errors.size) {
	// 			request.session!.sessionFlash = {errors: errors, title: data.title, course: course}
	// 			return response.redirect('/content-management/add-course-details')
	// 		}
	// 		request.session!.sessionFlash = {courseAddedSuccessMessage: 'course_added_success_message'}

	// 		const savedCourse = await this.learningCatalogue.createCourse(course)

	// 		return response.redirect(`/content-management/course/${savedCourse.id}`)
	// 	}
	// }
}
