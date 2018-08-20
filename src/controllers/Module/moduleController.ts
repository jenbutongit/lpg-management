import {Request, Response, Router} from 'express'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {Module} from '../../learning-catalogue/model/module'
import * as youtube from '../../lib/youtube'
import {ContentRequest} from '../../extended'
import {ModuleValidator} from '../../learning-catalogue/validator/moduleValidator'

const logger = log4js.getLogger('controllers/courseController')

export class ModuleController {
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
		this.router.get('/content-management/add-module', this.getModule())
		this.router.post('/content-management/:courseId/add-module', this.setModule())
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/add-module')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest & {files: any}

			let module: Module

			let data = {
				...req.body,
			}

			const errors = await this.moduleValidator.check(data, ['title', 'location'])

			const courseId = request.params.courseId
			const course = await this.learningCatalogue.getCourse(courseId)

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, title: data.title, course: course}
				return response.redirect(`/content-management/course-preview/${courseId}`)
			}

			if (data.type == 'video') {
				const info = await youtube.getBasicYoutubeInfo(data.location)
				if (!info) {
					logger.error('Unable to get info on module via the Yotube API')
					response.sendStatus(500)
					return
				}

				const duration = await youtube.getDuration(info.id)
				if (!duration) {
					logger.error('Unable to get duration of module via the YouTube API')
					response.sendStatus(500)
					return
				}

				data.duration = duration
				data.title = data.title || info.title
			}

			data.startPage = 'Not set' // need this as placeholder or java falls over

			module = await this.moduleFactory.create(data)

			await this.learningCatalogue.createModule(courseId, module)

			response.redirect(`/content-management/course-preview/${courseId}`)
		}
	}
}
