import {LearningCatalogue} from '../../learning-catalogue'
import {Validator} from '../../learning-catalogue/validator/validator'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
import {Request, Response, Router} from 'express'
import {ContentRequest} from '../../extended'
import {Module} from '../../learning-catalogue/model/module'

export class FaceToFaceModuleController {
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

		this.router.get('/content-management/courses/:courseId/module-face-to-face', this.getModule())
		this.router.post('/content-management/courses/:courseId/module-face-to-face', this.setModule())
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/module-face-to-face')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest

			const data = {
				...req.body,
			}

			const course = response.locals.course

			if (data.days || data.hours || data.minutes) {
				if (data.days.isUndefined) {
					data.days = 0
				}
				if (data.hours.isUndefined) {
					data.hours = 0
				}
				if (data.minutes.isUndefined) {
					data.minutes = 0
				}

				data.duration = data.days * 86400 + data.hours * 3600 + data.minutes * 60
			}

			const errors = await this.moduleValidator.check(data, ['title', 'duration', 'description'])

			const module = await this.moduleFactory.create(data)

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, module: module}
				return response.redirect(`/content-management/courses/${course.id}/module-face-to-face`)
			}

			await this.learningCatalogue.createModule(course.id, module)

			return response.redirect(`/content-management/courses/${course.id}/preview`)
		}
	}
}
