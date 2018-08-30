import {LearningCatalogue} from '../../../learning-catalogue/index'
import {Validator} from '../../../learning-catalogue/validator/validator'
import {Request, Response, Router} from 'express'
import {EventFactory} from '../../../learning-catalogue/model/factory/eventFactory'

export class EventController {
	learningCatalogue: LearningCatalogue
	eventValidator: Validator<Event>
	eventFactory: EventFactory
	router: Router

	constructor(learningCatalogue: LearningCatalogue, eventValidator: Validator<Event>, eventFactory: EventFactory) {
		this.learningCatalogue = learningCatalogue
		this.eventValidator = eventValidator
		this.eventFactory = eventFactory
		this.router = Router()

		this.setRouterPaths()
	}

	private setRouterPaths() {
		this.router.get(
			// '/content-management/course/:courseId/module/:moduleId/events/:eventId?/date',
			'/content-management/courses/modules/events/date',
			this.getDateTime()
		)
		this.router.post(
			//'/content-management/courses/:courseId/modules/:moduleId/event-date/:eventId?',
			'/content-management/courses/modules/events/date',
			this.setDateTime()
		)
	}

	public getDateTime() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/events.html')
		}
	}

	public setDateTime() {
		return async (request: Request, response: Response) => {
			const data = {
				...request.body,
			}

			console.log(data['start-date-Month'])

			const courseId = request.params.courseId
			const moduleId = request.params.moduleId

			data.date = this.parseDateTime(data)

			console.log(data.date)

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

	private parseDateTime(data: any): Date {
		let date: Date = new Date()

		date.setFullYear(data['start-date-Month'])
		date.setMonth(data['start-date-Month'])
		date.setDate(data['start-date-Day'])
		date.setHours(data.hour)
		date.setMinutes(data.minute)
		date.setSeconds(0)
		date.setMilliseconds(0)

		return date
	}
}
