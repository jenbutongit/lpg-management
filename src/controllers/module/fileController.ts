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
		this.router.post('/content-management/courses/:courseId/module-file/:moduleId', this.editFile())
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
			} else if (request.params.moduleId) {
				const module = response.locals.module
				let mediaId = module.mediaId

				if (module.type === Module.Type.VIDEO) {
					const items = module.url.split('/')
					mediaId = items[items.length - 2]
				}
				const media = await this.restService.get(`/${mediaId}`)

				return response.render('page/course/module/module-file', {type: type, media: media, courseCatalogueUrl: config.COURSE_CATALOGUE.url + '/media'})
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

	public editFile() {
		return async (request: Request, response: Response) => {
			let data = {
				...request.body,
			}

			data.type = fileType.getFileModuleType(data.file)

			const course = response.locals.course
			let module = response.locals.module
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

			module.type = data.type
			module.title = data.title
			module.description = data.description
			module.optional = data.isOptional || false
			module.duration = moment.duration({hours: data.hours, minutes: data.minutes}).asSeconds()
			module.fileSize = file.fileSizeKB
			module.mediaId = file.id
			module.url = config.CONTENT_URL + '/' + file.path
			module.startPage = file.metadata.startPage

			await this.learningCatalogue.updateModule(course.id, module)
			return request.session!.save(() => {
				response.redirect(`/content-management/courses/${course.id}/preview`)
			})
		}
	}
}
