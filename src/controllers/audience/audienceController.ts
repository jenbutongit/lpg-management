import {Request, Response, Router} from 'express'
import {AudienceFactory} from '../../learning-catalogue/model/factory/audienceFactory'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../../learning-catalogue'

const logger = log4js.getLogger('controllers/audienceController')

export class AudienceController {
	learningCatalogue: LearningCatalogue
	audienceFactory: AudienceFactory
	router: Router

	constructor(learningCatalogue: LearningCatalogue, audienceFactory: AudienceFactory) {
		this.learningCatalogue = learningCatalogue
		this.audienceFactory = audienceFactory
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
		this.router.get('/content-management/courses/:courseId/audience', this.addAudience())
		// this.router.post('/content-management/courses/:courseId/audience', this.setAudience())
	}

	public addAudience() {
		logger.debug('Add audience page')

		return async (request: Request, response: Response) => {
			response.render('page/course/module/add-module')
		}
	}

	// public setAudience() {
	// 	return async (request: Request, response: Response) => {
	// 		const moduleType = request.body.module
	// 		const courseId = response.locals.course.id

	// 		if (moduleType === '') {
	// 			return response.redirect(`/content-management/courses/${courseId}/audience`)
	// 		}

	// 		return response.redirect(`/content-management/courses/${courseId}/audience/${audienceId}`)
	// 	}
	// }
}
