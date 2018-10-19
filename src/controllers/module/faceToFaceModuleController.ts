import { LearningCatalogue } from '../../learning-catalogue'
import { Validator } from '../../learning-catalogue/validator/validator'
import { ModuleFactory } from '../../learning-catalogue/model/factory/moduleFactory'
import { Request, Response, Router } from 'express'
import { Module } from '../../learning-catalogue/model/module'

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

		this.router.get('/content-management/courses/:courseId/module-classroom/:moduleId?', this.getModule())
		this.router.post('/content-management/courses/:courseId/module-classroom/:moduleId?', this.setModule())
		this.router.get(
			'/content-management/courses/:courseId/module-classroom/:moduleId/add-learning-provider',
			this.getLearnerProvider()
		)
		this.router.post(
			'/content-management/courses/:courseId/module-classroom/:moduleId/add-learning-provider',
			this.setLearnerProvider()
		)
	}

	public getModule() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/module-classroom')
		}
	}

	public setModule() {
		return async (request: Request, response: Response) => {
			const data = {
				...request.body,
			}

			const course = response.locals.course

			const errors = await this.moduleValidator.check(data, ['title', 'description'])

			const module = await this.moduleFactory.create(data)

			if (errors.size) {
				request.session!.sessionFlash = { errors: errors, module: module }
				return response.redirect(`/content-management/courses/${course.id}/module-classroom`)
			}

			const catalogueModule: Module = await this.learningCatalogue.createModule(course.id, module)

			return response.redirect(
				`/content-management/courses/${course.id}/module-classroom/${catalogueModule.id}/add-learning-provider`
			)
		}
	}

	public getLearnerProvider() {
		return async (request: Request, response: Response) => {
			response.render('page/learning-provider/add-learning-provider-to-course')
		}
	}

	public setLearnerProvider() {
		return async (request: Request, response: Response) => {
			response.render('page/learning-provider/add-learning-provider-policies')
		}
	}
}
