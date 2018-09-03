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
		this.router.param('courseId', async (req, res, next, courseId) => {
			const course = await this.learningCatalogue.getCourse(courseId)

			if (course) {
				res.locals.course = course
				next()
			} else {
				res.sendStatus(404)
			}
		})

		this.router.param('moduleId', async (req, res, next, moduleId) => {
			const module = await this.learningCatalogue.getModule(res.locals.course.id, moduleId)

			if (module) {
				res.locals.module = module
				next()
			} else {
				res.sendStatus(404)
			}
		})

		this.router.param('eventId', async (req, res, next, eventId) => {
			const event = await this.learningCatalogue.getEvent(res.locals.course.id, res.locals.module.id, eventId)

			if (module) {
				res.locals.event = event
				next()
			} else {
				res.sendStatus(404)
			}
		})

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId?', this.getDateTime())
		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId?', this.setDateTime())
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events-preview', this.getDatePreview())
	}

	public getDateTime() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/events')
		}
	}

	public setDateTime() {
		return async (request: Request, response: Response) => {
			let data = {
				...request.body,
			}

			const courseId = request.params.courseId
			const moduleId = request.params.moduleId
			const eventId = request.params.eventId

			data.dateRanges = []
			data.dateRanges[0] = this.parseDate(data)

			const date: Date = this.getDate(data, true)

			let errors = await this.eventValidator.check(data, ['event.dateRanges'])
			if (!this.minDate(date, new Date(Date.now()))) {
				errors.fields.minDate = ['validation.module.event.dateRanges.past']
				errors.size++
			}

			let event
			if (eventId) {
				event = response.locals.event

				event.dateRanges.push(data.dateRanges[0])
			} else {
				event = await this.eventFactory.create(data)

				response.locals.event = event
			}

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, event: event}
				return response.redirect(`/content-management/courses/${courseId}/modules/${moduleId}/events`)
			}

			if (eventId) {
				const savedEvent = await this.learningCatalogue.updateEvent(courseId, moduleId, eventId, event)
				request.session!.sessionFlash = {event: savedEvent}
			} else {
				const savedEvent = await this.learningCatalogue.createEvent(courseId, moduleId, event)
				request.session!.sessionFlash = {event: savedEvent}
			}

			return response.redirect(`/content-management/courses/${courseId}/modules/${moduleId}/events-preview`)
		}
	}

	public getDatePreview() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/events-preview')
		}
	}

	private minDate(date: Date, minDate: Date): boolean {
		if (date < minDate) {
			return false
		}
		return true
	}

	private getDate(data: any, start: boolean) {
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

	private parseDate(data: any) {
		let dateRanges
		if (data['start-date-Year'] && data['start-date-Month'] && data['start-date-Day']) {
			dateRanges = {date: '', startTime: '', endTime: ''}

			dateRanges.date = (
				data['start-date-Year'] +
				'-' +
				data['start-date-Month'] +
				'-' +
				data['start-date-Day']
			).toString()

			dateRanges.startTime = (data['start-time'][0] + ':' + data['start-time'][1] + ':00').toString()
			dateRanges.endTime = (data['end-time'][0] + ':' + data['end-time'][1] + ':00').toString()
		}

		return dateRanges
	}
}
