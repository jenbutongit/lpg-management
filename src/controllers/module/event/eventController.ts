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
		this.router.param('moduleId', async (req, res, next, moduleId, courseId) => {
			const module = await this.learningCatalogue.getModule(courseId, moduleId)

			if (module) {
				res.locals.module = module
				next()
			} else {
				res.sendStatus(404)
			}
		})

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

		this.router.get('/content-management/course/modules/events/events-preview', this.getDatePreview())
	}

	public getDateTime() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/events')
		}
	}

	public setDateTime() {
		return async (request: Request, response: Response) => {
			const data = {
				...request.body,
			}

			// const courseId = request.params.courseId
			// const moduleId = request.params.moduleId

			//const module = response.locals.module

			if (data['start-date-Year'] && data['start-date-Month'] && data['start-date-Day']) {
				data.startTime = this.parseDateTime(data, true)
				data.endTime = this.parseDateTime(data, false)
			}

			const errors = await this.eventValidator.check(data, ['event.startTimes'])

			const event = await this.eventFactory.create(data)

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, event: event}
				//response.redirect(`/content-management/courses/${courseId}/module/${moduleId}/event`)
				return response.redirect(`/content-management/courses/modules/events/date`)
			}

			//module.events.push(event)

			request.session!.sessionFlash = {event: event}
			//response.redirect(`/content-management/courses/${courseId}/module/${moduleId}/event`)
			return response.redirect('/content-management/course/modules/events/events-preview')
		}
	}

	public getDatePreview() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/events-preview')
		}
	}

	private parseDateTime(data: any, start: boolean): Date {
		let date: Date = new Date()

		date.setFullYear(data['start-date-Year'])
		date.setMonth(data['start-date-Month'])
		date.setDate(data['start-date-Day'])

		if (start) {
			date.setHours(data['start-time'][0])
			date.setMinutes(data['start-time'][1])
		} else {
			date.setHours(data['end-time'][0])
			date.setMinutes(data['end-time'][1])
		}

		date.setSeconds(0)
		date.setMilliseconds(0)

		return date
	}
}
