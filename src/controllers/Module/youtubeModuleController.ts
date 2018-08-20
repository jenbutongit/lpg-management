import {Request, Response, Router} from 'express'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import * as youtube from '../../lib/youtube'
import {ContentRequest} from '../../extended'
import {ModuleValidator} from '../../learning-catalogue/validator/moduleValidator'

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
		this.router.get('/content-management/course/:courseId/add-module', this.getModule())
		this.router.post('/content-management/course/:courseId/add-module', this.setModule())
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/add-module')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest & {files: any}

			let data = {
				...req.body,
			}

			const courseId = request.params.courseId
			const course = await this.learningCatalogue.getCourse(courseId)

			const module = await this.moduleFactory.create(data)

			let errors = await this.moduleValidator.check(data, ['title', 'location'])

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, module: module, course: course}
				return response.redirect(`/content-management/courses/${courseId}/preview`)
			}

			const info = await youtube.getBasicYoutubeInfo(data.location)
			if (!info) {
				logger.error('Unable to get info on module via the Yotube API')

				errors = {fields: ['validation.course.video.notFound'], size: 1}
				request.session!.sessionFlash = {errors: errors, title: data.title, course: course}
				return response.redirect(`/content-management/courses/${courseId}/preview`)
			}

			const duration = await youtube.getDuration(info.id)
			if (!duration) {
				logger.error('Unable to get duration of module via the YouTube API')

				errors = {fields: ['validation.course.video.noDuration'], size: 1}
				request.session!.sessionFlash = {errors: errors, title: data.title, course: course}
				return response.redirect(`/content-management/courses/${courseId}/preview`)
			}

			data.duration = duration
			data.title = data.title || info.title
			data.startPage = 'Not set' // need this as placeholder or java falls over

			await this.learningCatalogue.createModule(courseId, module)

			response.redirect(`/content-management/courses/${courseId}/preview`)
		}
	}
}
