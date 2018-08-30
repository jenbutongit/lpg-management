import {LearningCatalogue} from '../../../learning-catalogue/index'
import {Validator} from '../../../learning-catalogue/validator/validator'
import {ModuleFactory} from '../../../learning-catalogue/model/factory/moduleFactory'
import {Request, Response, Router} from 'express'
import {ContentRequest} from '../../../extended'
import {EventFactory} from '../../../learning-catalogue/model/factory/eventFactory'

export class eventController {
	learningCatalogue: LearningCatalogue
	eventValidator: Validator<Event>
	eventFactory: EventFactory
	router: Router

	constructor(learningCatalogue: LearningCatalogue, eventValidator: Validator<Event>, eventFactory: ModuleFactory) {
		this.learningCatalogue = learningCatalogue
		this.eventValidator = eventValidator
		this.eventFactory = eventFactory
		this.router = Router()

		this.setRouterPaths()
	}

	private setRouterPaths() {
		this.router.get(
			'/content-management/course/:courseId/module/:moduleId/events/:eventId?/date',
			this.getDateTime()
		)
		this.router.post('/content-management/course/:courseId/:moduleId/event-date', this.setDateTime())
	}

	public getDateTime() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/event/')
		}
	}

	public setDateTime() {
		return async (request: Request, response: Response) => {
			const req = request as ContentRequest

			const data = {
				...req.body,
			}

			const courseId = request.params.courseId
			const moduleId = request.params.moduleId

			const errors = await this.eventValidator.check(data, ['date'])

			const event = await this.eventFactory.create(data)

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, event: event}
				response.redirect(`/content-management/courses/${courseId}/module/${moduleId}/event`)
			}

			request.session!.sessionFlash = {event: event}
			response.redirect(`/content-management/courses/${courseId}/module/${moduleId}/event`)
		}
	}
}
