import {Request, Response, Router} from 'express'
import {LearningCatalogue} from '../../learning-catalogue'
import {ModuleFactory} from '../../learning-catalogue/model/factory/moduleFactory'
// import {ContentRequest} from '../../extended'
import {ModuleValidator} from '../../learning-catalogue/validator/moduleValidator'

export class FileController {
	learningCatalogue: LearningCatalogue
	moduleValidator: ModuleValidator
	moduleFactory: ModuleFactory
	router: Router

	constructor(learningCatalogue: LearningCatalogue, moduleFactory: ModuleFactory) {
		this.learningCatalogue = learningCatalogue
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
		this.router.get('/content-management/courses/:courseId/module/add-file', this.getFile())
		this.router.post('/content-management/courses/:courseId/module/add-file', this.setFile())
	}
	public getFile() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/add-file')
		}
	}
	public setFile() {
		return async (request: Request, response: Response) => {
			// const req = request as ContentRequest
			// let data = {
			// 	...req.body,
			// }
			const course = response.locals.course
			// let module = await this.moduleFactory.create(data)
			// let errors = await this.moduleValidator.check(data, ['title', 'description'])

			// if (Object.keys(errors.fields).length != 0) {
			// 	request.session!.sessionFlash = {errors: errors, module: module}
			// 	return response.redirect(`/content-management/courses/${course.id}/module/add-file`)
			// }
			// const newData = {
			// 	id: data.id || 'testid',
			// 	type: data.type || 'file',
			// 	title: data.title || 'test title',
			// 	description: data.description || 'test description',
			// 	optional: data.isOptional || false,
			// }
			// module = await this.moduleFactory.create(newData)
			// await this.learningCatalogue.createModule(course.id, module)
			response.redirect(`/content-management/courses/${course.id}/preview`)
		}
	}
}
