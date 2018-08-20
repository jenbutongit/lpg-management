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

		this.router.get('/content-management/courses/:courseId/add-module', this.addModule())
		this.router.post('/content-management/courses/:courseId/add-module', this.setModule())

		// this.router.get('/content-management/add-course', this.getCourseTitle())
		// this.router.post('/content-management/add-course', this.setCourseTitle())
		// this.router.get('/content-management/add-course-details', this.getCourseDetails())
		// this.router.post('/content-management/add-course-details', this.setCourseDetails())

		// this.router.get('/content-management/course-preview/:courseId', this.coursePreview())
	}

	public addModule() {
		logger.debug('Add module page')

		return async (request: Request, response: Response) => {
			response.render('page/course/module/add-module')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const errors = await this.moduleValidator.check(request.body, ['module'])
			if (errors.size) {
				request.session!.sessionFlash = {errors: errors}
				return response.redirect('/content-management/courses/:courseID/add-module')
			}

			response.render('page/course/module/:courseID/{{module}}')
		}
	}
}
