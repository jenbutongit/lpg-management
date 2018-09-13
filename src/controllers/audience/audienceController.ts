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
		this.router.post('/content-management/courses/:courseId/audience', this.setAudience())
		this.router.get('/content-management/courses/:courseId/audience-type', this.addAudienceType())
		this.router.post('/content-management/courses/:courseId/audience-type', this.setAudienceType())
	}

	public addAudience() {
		logger.debug('Add audience page')

		return async (request: Request, response: Response) => {
			response.render('page/course/audience/audience-name')
		}
	}

	public setAudience() {
		return async (request: Request, response: Response) => {
			const courseId = response.locals.course.id

			if (name === '') {
				return response.redirect(`/content-management/courses/${courseId}/audience`)
			}
			//To be completed
			return response.redirect(`/content-management/courses/${courseId}/audience-type/`)
		}
	}

	public addAudienceType() {
		logger.debug('Add audience type page')

		return async (request: Request, response: Response) => {
			response.render('page/course/audience/audience-type')
		}
	}

	public setAudienceType() {
		return async (request: Request, response: Response) => {
			const courseId = response.locals.course.id

			return response.redirect(`/content-management/courses/${courseId}/audience-type/`)
		}
	}
}
