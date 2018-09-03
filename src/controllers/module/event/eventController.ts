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
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/date', this.getDateTime())
		this.router.get(
			'/content-management/courses/:courseId/modules/:moduleId/events/:eventId/date',
			this.getDateTime()
		)

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/date', this.setDateTime())
		this.router.post(
			'/content-management/courses/:courseId/modules/:moduleId/events/:eventId/date',
			this.setDateTime()
		)

		this.router.get(
			// '/content-management/courses/:courseId/modules/:moduleId/events/location',
			'/content-management/courses/modules/events/location',
			this.getLocation()
		)
		this.router.get(
			'/content-management/courses/:courseId/modules/:moduleId/events/:eventId/location',
			this.getLocation()
		)

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/location', this.setLocation())
		this.router.post(
			'/content-management/courses/:courseId/modules/:moduleId/events/:eventId/location',
			this.setLocation()
		)
	}

	public getDateTime() {
		return async (req: Request, res: Response) => {
			res.render('page/course/module/event/')
		}
	}

	public setDateTime() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}

			const errors = await this.eventValidator.check(data, ['event.date'])
			const event = await this.eventFactory.create(data)

			if (errors.size) {
				req.session!.sessionFlash = {errors: errors, event: event}
				res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events`)
			}

			req.session!.sessionFlash = {event: event}
			res.redirect(`/content-management/courses/${req.params.courseId}/module/${req.params.moduleId}/events`)
		}
	}

	public getLocation() {
		return async (req: Request, res: Response) => {
			res.render('page/course/module/event/event-location')
		}
	}

	public setLocation() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}

			const errors = await this.eventValidator.check(data, ['event.location'])
			const event = await this.eventFactory.create(data)

			if (errors.size) {
				req.session!.sessionFlash = {errors: errors, event: event}
				res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events`)
			}

			req.session!.sessionFlash = {event: event}
			res.redirect(`/content-management/courses/${req.params.courseId}/module/${req.params.moduleId}/events`)
		}
	}
}
