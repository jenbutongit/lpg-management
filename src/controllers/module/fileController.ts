import {Request, Response, Router} from 'express'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {ContentRequest} from '../../extended'
import {Validator} from '../../learning-catalogue/validator/validator'
import {Module} from '../../learning-catalogue/model/module'
import {RestService} from '../../learning-catalogue/service/restService'
import * as config from '../../config'

export class FileController {
	learningCatalogue: LearningCatalogue
	moduleValidator: Validator<Module>
	moduleFactory: ModuleFactory
	router: Router
	restService: RestService

	constructor(
		learningCatalogue: LearningCatalogue,
		moduleValidator: Validator<Module>,
		moduleFactory: ModuleFactory,
		restService: RestService
	) {
		this.learningCatalogue = learningCatalogue
		this.moduleFactory = moduleFactory
		this.moduleValidator = moduleValidator
		this.router = Router()
		this.setRouterPaths()

		this.restService = restService
	}

	/* istanbul ignore next */
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
		this.router.get('/content-management/courses/:courseId/module-file', this.getFile())
		this.router.post('/content-management/courses/:courseId/module-file', this.setFile())
	}

	public getFile() {
		return async (request: Request, response: Response) => {
			if (
				request.session!.sessionFlash &&
				request.session!.sessionFlash.mediaId &&
				request.session!.sessionFlash.mediaId != 'undefined'
			) {
				const mediaId = request.session!.sessionFlash.mediaId

				const media = await this.restService.get(`/${mediaId}`)

				return response.render('page/course/module/module-file', {mediaId, media})
			}

			return response.render('page/course/module/module-file')
		}
	}

	public setFile() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest
			let data = {
				...req.body,
			}

			const course = response.locals.course
			let module = await this.moduleFactory.create(data)
			let errors = await this.moduleValidator.check(data, ['title', 'description', 'file'])

			const mediaId = data.mediaId
			let file
			if (mediaId) {
				file = await this.restService.get(`/${mediaId}`)
			} else {
				errors.fields.file = ['validation_module_mediaId_empty']
			}

			if (Object.keys(errors.fields).length != 0) {
				request.session!.sessionFlash = {
					errors: errors,
					module: module,
					mediaId: mediaId,
					media: file,
				}

				return request.session!.save(() => {
					response.redirect(`/content-management/courses/${course.id}/module-file`)
				})
			}

			const newData = {
				id: data.id,
				type: data.type,
				title: data.title,
				description: data.description,
				file: data.file,
				optional: data.isOptional || false,
				duration: data.days * 86400 + data.hours * 3600 + data.minutes * 60,
				fileSize: file.fileSizeKB,
				mediaId: file.id,
				url: config.CONTENT_URL + '/' + file.path,
			}
			module = await this.moduleFactory.create(newData)

			await this.learningCatalogue.createModule(course.id, module)
			response.redirect(`/content-management/courses/${course.id}/preview`)
		}
	}
}
