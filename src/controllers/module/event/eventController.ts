import {LearningCatalogue} from '../../../learning-catalogue/index'
import {Validator} from '../../../learning-catalogue/validator/validator'
import {NextFunction, Request, Response, Router} from 'express'
import {EventFactory} from '../../../learning-catalogue/model/factory/eventFactory'
import {Event} from '../../../learning-catalogue/model/event'
import * as moment from 'moment'
import {DateRangeCommand} from '../../command/dateRangeCommand'
import {DateRange} from '../../../learning-catalogue/model/dateRange'
import {DateRangeCommandFactory} from '../../command/factory/dateRangeCommandFactory'
import {DateTime} from '../../../lib/dateTime'
import {IdentityService} from '../../../identity/identityService'
import {LearnerRecord} from '../../../learner-record'
import {InviteFactory} from '../../../learner-record/model/factory/inviteFactory'
import * as config from '../../../config'
import {Booking} from '../../../learner-record/model/booking'
import * as asyncHandler from 'express-async-handler'
import {Validate} from '../../formValidator'
import {FormController} from '../../formController'
import {Course} from '../../../learning-catalogue/model/course'
import {Module} from '../../../learning-catalogue/model/module'

export class EventController implements FormController {
	learningCatalogue: LearningCatalogue
	learnerRecord: LearnerRecord
	validator: Validator<Booking>
	eventValidator: Validator<Event>
	eventFactory: EventFactory
	inviteFactory: InviteFactory
	dateRangeCommandValidator: Validator<DateRangeCommand>
	dateRangeValidator: Validator<DateRange>
	dateRangeCommandFactory: DateRangeCommandFactory
	identityService: IdentityService
	router: Router

	constructor(
		learningCatalogue: LearningCatalogue,
		learnerRecord: LearnerRecord,
		eventValidator: Validator<Event>,
		bookingValidator: Validator<Booking>,
		eventFactory: EventFactory,
		inviteFactory: InviteFactory,
		dateRangeCommandValidator: Validator<DateRangeCommand>,
		dateRangeValidator: Validator<DateRange>,
		dateRangeCommandFactory: DateRangeCommandFactory,
		identityService: IdentityService
	) {
		this.learningCatalogue = learningCatalogue
		this.learnerRecord = learnerRecord
		this.eventValidator = eventValidator
		this.validator = bookingValidator
		this.eventFactory = eventFactory
		this.inviteFactory = inviteFactory
		this.dateRangeCommandValidator = dateRangeCommandValidator
		this.dateRangeValidator = dateRangeValidator
		this.dateRangeCommandFactory = dateRangeCommandFactory
		this.identityService = identityService
		this.router = Router()

		this.setRouterPaths()
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.param(
			'eventId',
			asyncHandler(async (req: Request, res: Response, next: NextFunction, eventId: string) => {
				const event = await this.learningCatalogue.getEvent(req.params.courseId, req.params.moduleId, eventId)
				if (event) {
					res.locals.event = event
					res.locals.courseId = req.params.courseId
					res.locals.moduleId = req.params.moduleId
					next()
				} else {
					res.sendStatus(404)
				}
			})
		)

		this.router.param(
			'eventId',
			asyncHandler(async (req: Request, res: Response, next: NextFunction, eventId: string) => {
				const invitees = await this.learnerRecord.getEventInvitees(eventId)

				if (invitees) {
					res.locals.invitees = invitees
					next()
				} else {
					res.sendStatus(404)
				}
			})
		)

		this.router.param(
			'courseId',
			asyncHandler(async (req: Request, res: Response, next: NextFunction, courseId: string) => {
				const date = new Date(Date.now())
				res.locals.exampleYear = date.getFullYear() + 1
				next()
			})
		)

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/location/create', asyncHandler(this.getLocation()))

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/location', asyncHandler(this.editLocation()))

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/location/', asyncHandler(this.setLocation()))

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/location/:eventId', asyncHandler(this.updateLocation()))

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events-preview/:eventId?', asyncHandler(this.getDatePreview()))
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events-overview/:eventId', asyncHandler(this.getEventOverview()))

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/', asyncHandler(this.getDateTime()))
		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/', asyncHandler(this.setDateTime()))

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/dateRanges/:dateRangeIndex', asyncHandler(this.editDateRange()))

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/dateRanges/', asyncHandler(this.dateRangeOverview()))

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/dateRanges/', asyncHandler(this.addDateRange()))

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/dateRanges/:dateRangeIndex', asyncHandler(this.updateDateRange()))

		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/attendee/:bookingId', asyncHandler(this.getAttendeeDetails()))

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/attendee/:bookingId/update', asyncHandler(this.updateBooking()))
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/cancel', asyncHandler(this.cancelEvent()))
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/attendee/:bookingId/cancel', asyncHandler(this.getCancelBooking()))
		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/attendee/:bookingId/cancel', asyncHandler(this.cancelBooking()))

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/attendee/:bookingId/update', this.updateBooking())
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/cancel', this.cancelEvent())

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/events/:eventId/invite', asyncHandler(this.inviteLearner()))
		this.router.get('/content-management/courses/:courseId/modules/:moduleId/learning-provider/:eventId', this.getLearningProvider())

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/learning-provider/:eventId', this.setLearningProvider())

		this.router.post('/content-management/courses/:courseId/modules/:moduleId/learning-provider/:eventId/policies', this.getPolicies())
	}
	public getDateTime() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/events', {courseId: request.params.courseId, moduleId: request.params.moduleId})
		}
	}

	public setDateTime() {
		return async (request: Request, response: Response) => {
			let data = {
				...request.body,
			}
			const event = data.eventJson ? JSON.parse(data.eventJson) : this.eventFactory.create({})
			let errors = await this.dateRangeCommandValidator.check(data)

			if (errors.size) {
				response.render('page/course/module/events/events', {
					event: event,
					courseId: request.params.courseId,
					moduleId: request.params.moduleId,
					eventJson: JSON.stringify(event),
					errors: errors,
				})
			} else {
				const dateRangeCommand: DateRangeCommand = this.dateRangeCommandFactory.create(data)
				const dateRange: DateRange = dateRangeCommand.asDateRange()

				errors = await this.dateRangeValidator.check(dateRange)

				if (errors.size) {
					const event = data.eventJson ? JSON.parse(data.eventJson) : this.eventFactory.create({})
					response.render('page/course/module/events/events', {
						event: event,
						courseId: request.params.courseId,
						moduleId: request.params.moduleId,
						eventJson: JSON.stringify(event),
						errors: errors,
					})
				} else {
					const event = data.eventJson ? JSON.parse(data.eventJson) : this.eventFactory.create({})
					event.dateRanges.push(dateRange)

					response.render('page/course/module/events/events', {
						event: event,
						courseId: request.params.courseId,
						moduleId: request.params.moduleId,
						eventJson: JSON.stringify(event),
					})
				}
			}
		}
	}

	public dateRangeOverview() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/event-dateRange-edit')
		}
	}

	public editDateRange() {
		return async (request: Request, response: Response) => {
			const dateRangeIndex = request.params.dateRangeIndex

			const event = response.locals.event

			const dateRange = event!.dateRanges![dateRangeIndex]

			const date: any = moment(dateRange.date)

			const startTime = moment(dateRange.startTime, 'HH:mm')
			const endTime = moment(dateRange.endTime, 'HH:mm')

			response.render('page/course/module/events/event-dateRange-edit', {
				day: date.date(),
				month: date.month() + 1,
				year: date.year(),
				startHours: startTime.format('HH'),
				startMinutes: startTime.format('mm'),
				endHours: endTime.format('HH'),
				endMinutes: endTime.format('mm'),
				dateRangeIndex: dateRangeIndex,
			})
		}
	}

	public addDateRange() {
		return async (request: Request, response: Response) => {
			let data = {
				...request.body,
			}

			const courseId = request.params.courseId
			const moduleId = request.params.moduleId
			const eventId = request.params.eventId

			const errors = await this.dateRangeCommandValidator.check(data)

			if (errors.size) {
				response.render('page/course/module/events/event-dateRange-edit', {
					errors: errors,
					day: request.body.day,
					month: request.body.month,
					year: request.body.year,
					startHours: request.body.startHours,
					startMinutes: request.body.startMinutes,
					endHours: request.body.endHours,
					endMinutes: request.body.endMinutes,
					courseId: courseId,
					moduleId: moduleId,
				})
			} else {
				const dateRangeCommand = this.dateRangeCommandFactory.create(data)
				const dateRange = dateRangeCommand.asDateRange()

				const errors = await this.dateRangeValidator.check(dateRange)
				if (errors.size) {
					response.render('page/course/module/events/event-dateRange-edit', {
						errors: errors,
						day: request.body.day,
						month: request.body.month,
						year: request.body.year,
						startHours: request.body.startHours,
						startMinutes: request.body.startMinutes,
						endHours: request.body.endHours,
						endMinutes: request.body.endMinutes,
						courseId: courseId,
						moduleId: moduleId,
					})
				} else {
					const event = await this.learningCatalogue.getEvent(courseId, moduleId, eventId)

					event!.dateRanges!.push(dateRange)

					await this.learningCatalogue.updateEvent(courseId, moduleId, eventId, event)

					response.redirect(`/content-management/courses/${courseId}/modules/${moduleId}/events/${eventId}/dateRanges`)
				}
			}
		}
	}

	public updateDateRange() {
		return async (request: Request, response: Response) => {
			let data = {
				...request.body,
			}

			const courseId = request.params.courseId
			const moduleId = request.params.moduleId
			const eventId = request.params.eventId
			const dateRangeIndex = request.params.dateRangeIndex

			const errors = await this.dateRangeCommandValidator.check(data)

			if (errors.size) {
				response.render('page/course/module/events/event-dateRange-edit', {
					errors: errors,
					day: request.body.day,
					month: request.body.month,
					year: request.body.year,
					startHours: request.body.startHours,
					startMinutes: request.body.startMinutes,
					endHours: request.body.endHours,
					endMinutes: request.body.endMinutes,
					dateRangeIndex: dateRangeIndex,
				})
			} else {
				const dateRangeCommand = this.dateRangeCommandFactory.create(data)
				const dateRange = dateRangeCommand.asDateRange()

				const errors = await this.dateRangeValidator.check(dateRange)
				if (errors.size) {
					response.render('page/course/module/events/event-dateRange-edit', {
						errors: errors,
						day: request.body.day,
						month: request.body.month,
						year: request.body.year,
						startHours: request.body.startHours,
						startMinutes: request.body.startMinutes,
						endHours: request.body.endHours,
						endMinutes: request.body.endMinutes,
						dateRangeIndex: dateRangeIndex,
					})
				} else {
					const event = await this.learningCatalogue.getEvent(courseId, moduleId, eventId)

					event!.dateRanges![dateRangeIndex] = dateRange

					await this.learningCatalogue.updateEvent(courseId, moduleId, eventId, event)

					response.redirect(`/content-management/courses/${courseId}/modules/${moduleId}/events/${eventId}/dateRanges`)
				}
			}
		}
	}

	public getDatePreview() {
		return async (req: Request, res: Response) => {
			const course: Course = await this.learningCatalogue.getCourse(req.params.courseId)
			const module: Module = await this.learningCatalogue.getModule(req.params.courseId, req.params.moduleId)

			res.render('page/course/module/events/events-preview', {course: course, module: module})
		}
	}

	public getLocation() {
		return async (req: Request, res: Response) => {
			res.render('page/course/module/events/event-location', {
				event: JSON.parse(req.body.eventJson || '{}'),
				eventJson: req.body.eventJson,
				courseId: req.params.courseId,
				moduleId: req.params.moduleId,
			})
		}
	}

	public setLocation() {
		return async (req: Request, res: Response) => {
			const data = {
				venue: {
					location: req.body.location,
					address: req.body.address,
					capacity: parseInt(req.body.capacity, 10),
					minCapacity: parseInt(req.body.minCapacity, 10),
				},
			}

			const errors = await this.eventValidator.check(data, ['event.location'])

			if (errors.size) {
				res.render('page/course/module/events/event-location', {
					eventJson: req.body.eventJson,
					errors: errors,
				})
			} else {
				let event = JSON.parse(req.body.eventJson || '{}')
				event.venue = data.venue

				const savedEvent = await this.learningCatalogue.createEvent(req.params.courseId, req.params.moduleId, event)
				res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events-overview/${savedEvent.id}`)
			}
		}
	}

	public editLocation() {
		return async (req: Request, res: Response) => {
			res.render('page/course/module/events/event-location')
		}
	}

	public updateLocation() {
		return async (req: Request, res: Response) => {
			const data = {
				venue: {
					location: req.body.location,
					address: req.body.address,
					capacity: parseInt(req.body.capacity),
					minCapacity: parseInt(req.body.minCapacity),
					availability: parseInt(req.body.capacity),
				},
			}

			const errors = await this.eventValidator.check(data, ['event.location'])

			if (errors.size) {
				res.render('page/course/module/events/event-location', {
					location: req.body.location,
					address: req.body.address,
					capacity: req.body.capacity,
					minCapacity: req.body.minCapacity,
					errors: errors,
				})
			} else {
				let event = await this.learningCatalogue.getEvent(req.params.courseId, req.params.moduleId, req.params.eventId)

				event.venue = data.venue

				await this.learningCatalogue.updateEvent(req.params.courseId, req.params.moduleId, req.params.eventId, event)
				res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events-overview/${req.params.eventId}`)
			}
		}
	}

	public getEventOverview() {
		return async (req: Request, res: Response) => {
			const course: Course = await this.learningCatalogue.getCourse(req.params.courseId)
			const module: Module = await this.learningCatalogue.getModule(req.params.courseId, req.params.moduleId)

			const event = res.locals.event
			const eventDateWithMonthAsText: string = DateTime.convertDate(event.dateRanges[0].date)

			const bookings = await this.learnerRecord.getEventBookings(event.id)
			const activeBookings = bookings.filter((booking: Booking) => booking.status != Booking.Status.CANCELLED)

			res.render('page/course/module/events/events-overview', {
				bookings: activeBookings,
				eventDateWithMonthAsText,
				course: course,
				module: module,
			})
		}
	}

	public cancelEvent() {
		return async (req: Request, res: Response) => {
			res.render('page/course/module/events/cancel')
		}
	}

	public inviteLearner() {
		return async (req: Request, res: Response) => {
			const data = {
				...req.body,
			}

			const emailAddress = data.learnerEmail

			data.event = `${config.COURSE_CATALOGUE.url}/courses/${req.params.courseId}/modules/${req.params.moduleId}/events/${req.params.eventId}`

			try {
				await this.learnerRecord.inviteLearner(req.params.eventId, this.inviteFactory.create(data))

				req.session!.sessionFlash = {
					emailAddressFoundMessage: 'email_address_found_message',
					emailAddress: emailAddress,
				}
			} catch (e) {
				if (e.toString().indexOf('learnerEmail: The learner must be registered') >= 0) {
					req.session!.sessionFlash = {
						emailAddressFoundMessage: 'email_address_not_found_message',
						emailAddress: emailAddress,
					}
				} else {
					req.session!.sessionFlash = {
						emailAddressFoundMessage: 'email_address_already_invited_message',
						emailAddress: emailAddress,
					}
				}
			}

			return req.session!.save(() => {
				res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events-overview/${req.params.eventId}`)
			})
		}
	}

	public getAttendeeDetails() {
		return async (req: Request, res: Response) => {
			const course: Course = await this.learningCatalogue.getCourse(req.params.courseId)
			const module: Module = await this.learningCatalogue.getModule(req.params.courseId, req.params.moduleId)

			const event = res.locals.event
			const eventDateWithMonthAsText: string = DateTime.convertDate(event.dateRanges[0].date)

			const bookings = await this.learnerRecord.getEventBookings(event.id)
			const bookingId = req.params.bookingId
			const booking = this.findBooking(bookings, bookingId)

			res.render('page/course/module/events/attendee', {
				booking,
				eventDateWithMonthAsText,
				course: course,
				module: module,
			})
		}
	}

	public updateBooking() {
		return async (req: Request, res: Response) => {
			const bookings = await this.learnerRecord.getEventBookings(req.params.eventId)
			const bookingId = req.params.bookingId
			const booking = this.findBooking(bookings, bookingId)

			booking.status = Booking.Status.CONFIRMED
			await this.learnerRecord.updateBooking(req.params.eventId, booking)

			return res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events/${req.params.eventId}/attendee/${req.params.bookingId}`)
		}
	}

	public getLearningProvider() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/learning-provider/index')
		}
	}

	public setLearningProvider() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/learning-provider/assign-learning-provider')
		}
	}

	public getPolicies() {
		return async (request: Request, response: Response) => {
			response.render('page/course/module/events/learning-provider/assign-policies')
		}
	}

	public getCancelBooking() {
		return async (req: Request, res: Response) => {
			const event = res.locals.event
			const eventDateWithMonthAsText: string = DateTime.convertDate(event.dateRanges[0].date)

			const bookings = await this.learnerRecord.getEventBookings(event.id)
			const bookingId = req.params.bookingId
			const booking = this.findBooking(bookings, bookingId)

			res.render('page/course/module/events/cancel-attendee', {
				booking: booking,
				eventDateWithMonthAsText: eventDateWithMonthAsText,
			})
		}
	}

	@Validate({
		fields: ['reason'],
		redirect: `/content-management/courses/:courseId/modules/:moduleId/events/:eventId/attendee/:bookingId/cancel`,
	})
	public cancelBooking() {
		return async (req: Request, res: Response) => {
			const data = {
				...req.body,
			}

			const bookings = await this.learnerRecord.getEventBookings(req.params.eventId)
			const bookingId = req.params.bookingId
			const booking = this.findBooking(bookings, bookingId)

			booking.status = Booking.Status.CANCELLED
			booking.cancellationReason = data.cancellationReason
			await this.learnerRecord.updateBooking(req.params.eventId, booking)

			return res.redirect(`/content-management/courses/${req.params.courseId}/modules/${req.params.moduleId}/events-overview/${req.params.eventId}`)
		}
	}
	private findBooking(bookings: any, bookingId: number): Booking {
		return bookings.find(function(booking: Booking) {
			return booking.id == bookingId
		})
	}
}
