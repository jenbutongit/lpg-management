import {Request, Response, Router} from 'express'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {ContentRequest} from '../../extended'
import {Validator} from '../../learning-catalogue/validator/validator'
import {Module} from '../../learning-catalogue/model/module'
import moment = require('moment')
import * as config from '../../config'
import * as fileType from '../../lib/fileType'
import {OauthRestService} from 'lib/http/oauthRestService'
import {CourseService} from 'lib/courseService'
import {FileModule} from '../../learning-catalogue/model/fileModule'

export class FileController {
	learningCatalogue: LearningCatalogue
	moduleValidator: Validator<Module>
	moduleFactory: ModuleFactory
	router: Router
	restService: OauthRestService
	courseService: CourseService

	constructor(
		learningCatalogue: LearningCatalogue,
		moduleValidator: Validator<Module>,
		moduleFactory: ModuleFactory,
		restService: OauthRestService,
		courseService: CourseService
	) {
		this.learningCatalogue = learningCatalogue
		this.moduleFactory = moduleFactory
		this.moduleValidator = moduleValidator
		this.courseService = courseService

		this.router = Router()
		this.setRouterPaths()

		this.restService = restService
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		let course: any

		this.router.param('courseId', async (req, res, next, courseId) => {
			course = await this.learningCatalogue.getCourse(courseId)
			if (course) {
				res.locals.course = course
				next()
			} else {
				res.sendStatus(404)
			}
		})
		this.router.param('moduleId', async (req, res, next, moduleId) => {
			if (course) {
				const module = this.courseService.getModuleByModuleId(course, moduleId)
				if (module) {
					const duration = moment.duration(module.duration, 'seconds')
					res.locals.module = module
					res.locals.module.hours = duration.hours()
					res.locals.module.minutes = duration.minutes()
					next()
				} else {
					res.sendStatus(404)
				}
			} else {
				res.sendStatus(404)
			}
		})
		this.router.get('/content-management/courses/:courseId/module-file/:moduleId?', this.getFile('file'))
		this.router.get('/content-management/courses/:courseId/module-elearning/:moduleId?', this.getFile('elearning'))
		this.router.get('/content-management/courses/:courseId/module-mp4/:moduleId?', this.getFile('video'))
		this.router.post('/content-management/courses/:courseId/module-file', this.setFile())
		this.router.post('/content-management/courses/:courseId/module-file/:moduleId?', this.updateMp4Module('file'))
		this.router.post('/content-management/courses/:courseId/module-e-learning/:moduleId?', this.updateMp4Module('elearning'))
		this.router.post('/content-management/courses/:courseId/module-mp4/:moduleId?', this.updateMp4Module('video'))
	}

	public getFile(type: string) {
		return async (request: Request, response: Response) => {
			if (request.session!.sessionFlash && request.session!.sessionFlash.mediaId) {
				const mediaId = request.session!.sessionFlash.mediaId

				const media = await this.restService.get(`/${mediaId}`)

				return response.render('page/course/module/module-file', {
					type: type,
					media,
					courseCatalogueUrl: config.COURSE_CATALOGUE.url + '/media',
				})
			}

			return response.render('page/course/module/module-file', {
				type: type,
				courseCatalogueUrl: config.COURSE_CATALOGUE.url + '/media',
			})
		}
	}

	public setFile() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest
			let data = {
				...req.body,
			}

			data.type = fileType.getFileModuleType(data.file)

			const course = response.locals.course
			let module = await this.moduleFactory.create(data)
			let errors = await this.moduleValidator.check(data, ['title', 'description', 'mediaId'])

			let file
			if (data.mediaId) {
				file = await this.restService.get(`/${data.mediaId}`)
			}

			if (errors.size) {
				request.session!.sessionFlash = {
					errors: errors,
					module: module,
					media: file,
				}

				return request.session!.save(() => {
					response.redirect(`/content-management/courses/${course.id}/module-${data.fileType}`)
				})
			}

			const newData = {
				id: data.id,
				type: data.type,
				title: data.title,
				description: data.description,
				optional: data.isOptional || false,
				duration: moment
					.duration({
						hours: data.hours,
						minutes: data.minutes,
					})
					.asSeconds(),
				fileSize: file.fileSizeKB,
				mediaId: file.id,
				url: config.CONTENT_URL + '/' + file.path,
				startPage: file.metadata.startPage,
			}
			module = await this.moduleFactory.create(newData)

			await this.learningCatalogue.createModule(course.id, module)
			response.redirect(`/content-management/courses/${course.id}/preview`)
		}
	}

	public updateMp4Module(type: string) {
		return async (req: Request, res: Response) => {
			const course = res.locals.course
			let file
			if (req.body.mediaId) {
				file = await this.restService.get(`/${req.body.mediaId}`)
			}
			let module: FileModule = res.locals.module
			module.title = req.body.title
			module.description = req.body.description
			module.url = req.body.url
			module.optional = req.body.optional
			module.fileSize = file.fileSizeKB
			module.mediaId = file.id
			module.duration = moment
				.duration({
					hours: req.body.hours,
					minutes: req.body.minutes,
				})
				.asSeconds()

			const errors = await this.moduleValidator.check(module, ['title', 'description', 'mediaId'])

			if (errors.size) {
				return res.render(`page/course/module/module-${type}`, {
					module: module,
					errors: errors,
				})
			}

			await this.learningCatalogue.updateModule(course.id, module)

			res.redirect(`/content-management/courses/${course.id}/add-module`)
		}
	}
}
