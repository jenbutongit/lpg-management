import {Request, Response, Router} from 'express'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {ContentRequest} from '../../extended'
import {Validator} from '../../learning-catalogue/validator/validator'
import {Module} from '../../learning-catalogue/model/module'
import * as multer from 'multer'
import {LearningCatalogueConfig} from '../../learning-catalogue/learningCatalogueConfig'
import {RestService} from '../../learning-catalogue/service/restService'

export class FileController {
	learningCatalogue: LearningCatalogue
	moduleValidator: Validator<Module>
	moduleFactory: ModuleFactory
	router: Router
	storage: multer.StorageEngine = multer.memoryStorage()
	mediaConfig: LearningCatalogueConfig
	restService: RestService

	constructor(
		learningCatalogue: LearningCatalogue,
		moduleValidator: Validator<Module>,
		moduleFactory: ModuleFactory,
		mediaConfig: LearningCatalogueConfig
	) {
		this.learningCatalogue = learningCatalogue
		this.moduleFactory = moduleFactory
		this.moduleValidator = moduleValidator
		this.mediaConfig = mediaConfig
		this.router = Router()
		this.setRouterPaths()

		this.restService = new RestService(mediaConfig)
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
		this.router.get('/content-management/courses/:courseId/module-file/:mediaId?', this.getFile())
		this.router.post('/content-management/courses/:courseId/module-file/:mediaId', this.setFile())
	}

	public getFile() {
		return async (request: Request, response: Response) => {
			if (request.params.mediaId) {
				const mediaId = request.params.mediaId

				const media = await this.restService.get(`${mediaId}`)

				request.session!.sessionFlash = {mediaId: mediaId, media: media}
			}

			request.session!.save(() => {
				response.render('page/course/module/module-file')
			})
		}
	}

	public setFile() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest
			let data = {
				...req.body,
			}

			console.log(request.params.mediaId)

			const course = response.locals.course
			let module = await this.moduleFactory.create(data)
			let errors = await this.moduleValidator.check(data, ['title', 'description', 'file'])

			if (Object.keys(errors.fields).length != 0) {
				request.session!.sessionFlash = {errors: errors, module: module}
				return response.redirect(`/content-management/courses/${course.id}/module/module-file`)
			}

			const newData = {
				id: data.id,
				type: data.type,
				title: data.title,
				description: data.description,
				file: data.file,
				optional: data.isOptional || false,
			}
			module = await this.moduleFactory.create(newData)
			// To be implemented at a later stage
			// await this.learningCatalogue.createModule(course.id, module)
			response.redirect(`/content-management/courses/${course.id}/preview`)
		}
	}
}
