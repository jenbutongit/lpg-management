import {LearningCatalogue} from '../../../learning-catalogue/index'
import {Validator} from '../../../learning-catalogue/validator/validator'
import {Request, Response, Router} from 'express'
import {ContentRequest} from '../../../extended'
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

		this.router.param('moduleId', async (req, res, next, courseId, moduleId) => {
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
			'/content-management/course/module/events/date',
			this.getDateTime()
		)
		this.router.post(
			'/content-management/courses/:courseId/modules/:moduleId/event-date/:eventId?',
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
			const req = request as ContentRequest

			const data = {
				...req.body,
			}

			const course = response.locals.course
			const module = response.locals.module

			data.date = this.parseDateTime(data)

			const errors = await this.eventValidator.check(data, ['date'])

			const event = await this.eventFactory.create(data)

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors, event: event}
				response.redirect(`/content-management/courses/${course.id}/module/${module.id}/event`)
			}

			request.session!.sessionFlash = {event: event}
			response.redirect(`/content-management/courses/${course.id}/module/${module.id}/event`)
		}
	}

	private parseDateTime(data: any): Date {
		let date: Date = new Date()

		date.setFullYear(data.year)
		date.setMonth(data.month)
		date.setDate(data.day)
		date.setHours(data.hour)
		date.setMinutes(data.minute)
		date.setSeconds(0)
		date.setMilliseconds(0)

		return date
	}
}
