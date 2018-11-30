import {NextFunction, Request, Response, Router} from 'express'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {Module} from '../../learning-catalogue/model/module'
import {Validator} from '../../learning-catalogue/validator/validator'
import {YoutubeService} from '../../youtube/youtubeService'
import {VideoModule} from '../../learning-catalogue/model/videoModule'
import * as asyncHandler from 'express-async-handler'
import {CourseService} from 'lib/courseService'
import moment = require('moment')

export class YoutubeModuleController {
	learningCatalogue: LearningCatalogue
	moduleValidator: Validator<Module>
	moduleFactory: ModuleFactory
	youtube: YoutubeService
	courseService: CourseService

	router: Router

	constructor(learningCatalogue: LearningCatalogue, moduleValidator: Validator<Module>, moduleFactory: ModuleFactory, youtube: YoutubeService, courseService: CourseService) {
		this.learningCatalogue = learningCatalogue
		this.moduleValidator = moduleValidator
		this.moduleFactory = moduleFactory
		this.youtube = youtube
		this.courseService = courseService

		this.router = Router()
		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		let course: any
		this.router.param(
			'courseId',
			asyncHandler(async (req: Request, res: Response, next: NextFunction, courseId: string) => {
				course = await this.learningCatalogue.getCourse(courseId)

				if (course) {
					res.locals.course = course
					next()
				} else {
					res.sendStatus(404)
				}
			})
		)

		this.router.param(
			'moduleId',
			asyncHandler(async (req: Request, res: Response, next: NextFunction, moduleId: string) => {
				if (course) {
					const module = await this.courseService.getModuleByModuleId(course, moduleId)
					if (module) {
						const duration = moment.duration(module.duration, 'seconds')
						res.locals.module = module
						res.locals.module.hours = duration.hours()
						res.locals.module.minutes = duration.minutes()
						next()
					} else {
						res.sendStatus(404)
					}
				}
			})
		)

		this.router.get('/content-management/courses/:courseId/module-video/:moduleId?', this.getModule())
		this.router.post('/content-management/courses/:courseId/module-video', this.setModule())
		this.router.post('/content-management/courses/:courseId/module-video/:moduleId', this.updateModule())
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/module-youtube')
		}
	}

	public setModule() {
		return async (req: Request, res: Response) => {
			let data = {...req.body}

			const course = res.locals.course
			let module = await this.moduleFactory.create(data)
			let errors = await this.moduleValidator.check(data, ['title', 'url'])

			let duration

			const youtubeResponse = await this.youtube.getYoutubeResponse(data.url)

			if (!youtubeResponse || !this.youtube.checkYoutubeResponse(youtubeResponse)) {
				errors.fields.youtubeResponse = 'validation_module_video_notFound'
				errors.size += 1
			} else {
				const info = this.youtube.getBasicYoutubeInfo(youtubeResponse)

				duration = await this.youtube.getDuration(info.id)

				if (!duration) {
					errors.fields.youtubeDuration = 'validation_module_video_noDuration'
					errors.size += 1
				}
			}

			if (errors.size) {
				req.session!.sessionFlash = {errors: errors, module: module}
				req.session!.save(() => {
					res.redirect(`/content-management/courses/${course.id}/module-video`)
				})
			} else {
				const newData = {
					type: data.type || 'video',
					title: data.title,
					description: data.description || 'No description',
					duration: duration,
					optional: data.isOptional || false,
					url: data.url,
				}

				module = await this.moduleFactory.create(newData)
				await this.learningCatalogue.createModule(course.id, module)
				res.redirect(`/content-management/courses/${course.id}/preview`)
			}
		}
	}

	public updateModule() {
		return async (req: Request, res: Response) => {
			let data = {...req.body}

			let course = res.locals.course
			let module: VideoModule = res.locals.module

			let errors = await this.moduleValidator.check(data, ['title', 'url'])
			let duration

			const youtubeResponse = await this.youtube.getYoutubeResponse(data.url)

			if (!youtubeResponse || !this.youtube.checkYoutubeResponse(youtubeResponse)) {
				errors.fields.youtubeResponse = 'validation_module_video_notFound'
				errors.size += 1
			} else {
				const info = this.youtube.getBasicYoutubeInfo(youtubeResponse)

				duration = await this.youtube.getDuration(info.id)

				if (!duration) {
					errors.fields.youtubeDuration = 'validation_module_video_noDuration'
					errors.size += 1
				} else {
					module.duration = duration
				}
			}

			if (errors.size) {
				req.session!.sessionFlash = {errors: errors, module: module}
				req.session!.save(() => {
					res.redirect(`/content-management/courses/${course.id}/module-video`)
				})
			} else {
				module.title = data.title
				module.description = data.description
				module.optional = data.isOptional || false
				module.url = data.url

				await this.learningCatalogue.updateModule(course.id, module)
				res.redirect(`/content-management/courses/${course.id}/preview`)
			}
		}
	}
}
