import {Request, Response, Router} from 'express'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import * as youtube from '../../lib/youtube'
import {ContentRequest} from '../../extended'
import {ModuleValidator} from '../../learning-catalogue/validator/moduleValidator'
import {Module} from '../../learning-catalogue/model/module'

const logger = log4js.getLogger('controllers/courseController')

export class YoutubeModuleController {
	learningCatalogue: LearningCatalogue
	moduleValidator: ModuleValidator
	moduleFactory: ModuleFactory
	router: Router

	constructor(learningCatalogue: LearningCatalogue, moduleValidator: ModuleValidator, moduleFactory: ModuleFactory) {
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

		this.router.get('/content-management/courses/:courseId/add-youtube-module', this.getModule())
		this.router.post('/content-management/courses/:courseId/add-youtube-module', this.setModule())
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/add-module-youtube')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest

			let data = {
				...req.body,
			}

			const course = response.locals.course

			let module = await this.moduleFactory.create(data)

			let errors = await this.moduleValidator.check(data, ['title', 'location'])

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, module: module}
				return response.redirect(`/content-management/courses/${course.id}/add-youtube-module`)
			}

			const info = await youtube.getBasicYoutubeInfo(data.location)
			if (!info) {
				logger.error('Unable to get info on module via the Yotube API')

				return this.throwError('validation.course.video.notFound', 1, request, response, module)
			}

			const duration = await youtube.getDuration(info.id)
			if (!duration) {
				logger.error('Unable to get duration of module via the YouTube API')

				return this.throwError('validation.course.video.noDuration', 1, request, response, module)
			}

			data.duration = duration
			data.title = data.title || info.title
			data.startPage = 'Not set' // need this as placeholder or java falls over

			if (data.isOptional) {
				data.optional = true
			} else {
				data.optional = false
			}

			module = await this.moduleFactory.create(data)

			await this.learningCatalogue.createModule(course.id, module)

			response.redirect(`/content-management/courses/${course.id}/preview`)
		}
	}

	private throwError(errorMessage: string, size: number, request: Request, response: Response, module: Module) {
		const errors = {fields: {location: errorMessage}, size: size}
		request.session!.sessionFlash = {errors: errors, module: module}
		return response.redirect(`/content-management/courses/${response.locals.course.id}/add-youtube-module`)
	}
}
