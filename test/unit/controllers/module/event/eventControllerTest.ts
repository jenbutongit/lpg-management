import * as chai from 'chai'
import {expect} from 'chai'
import * as sinonChai from 'sinon-chai'
import {beforeEach} from 'mocha'
import {EventController} from '../../../../../src/controllers/module/event/eventController'
import {LearningCatalogue} from '../../../../../src/learning-catalogue'
import {Validator} from '../../../../../src/learning-catalogue/validator/validator'
import {Event} from '../../../../../src/learning-catalogue/model/event'
import {EventFactory} from '../../../../../src/learning-catalogue/model/factory/eventFactory'
import {mockReq, mockRes} from 'sinon-express-mock'
import {Request, Response} from 'express'
import * as sinon from 'sinon'
import {DateRange} from '../../../../../src/learning-catalogue/model/dateRange'
import {DateRangeCommand} from '../../../../../src/controllers/command/dateRangeCommand'
import {DateRangeCommandFactory} from '../../../../../src/controllers/command/factory/dateRangeCommandFactory'
import {Venue} from '../../../../../src/learning-catalogue/model/venue'
import {LearnerRecord} from '../../../../../src/learner-record'
import {Booking} from '../../../../../src/learner-record/model/booking'
import {DateTime} from '../../../../../src/lib/dateTime'
import {Course} from '../../../../../src/learning-catalogue/model/course'
import {Module} from '../../../../../src/learning-catalogue/model/module'

chai.use(sinonChai)

describe('EventController', function() {
	let eventController: EventController
	let learningCatalogue: LearningCatalogue
	let learnerRecord: LearnerRecord
	let validator: Validator<Booking>
	let eventValidator: Validator<Event>
	let eventFactory: EventFactory
	let dateRangeCommandValidator: Validator<DateRangeCommand>
	let dateRangeValidator: Validator<DateRange>
	let dateRangeCommandFactory: DateRangeCommandFactory

	beforeEach(() => {
		learningCatalogue = <LearningCatalogue>{}
		learnerRecord = <LearnerRecord>{}
		eventValidator = <Validator<Event>>{}
		validator = <Validator<Booking>>{}
		eventFactory = <EventFactory>{}
		dateRangeCommandValidator = <Validator<DateRangeCommand>>{}
		dateRangeValidator = <Validator<DateRange>>{}
		dateRangeCommandFactory = <DateRangeCommandFactory>{}

		eventController = new EventController(
			learningCatalogue,
			learnerRecord,
			eventValidator,
			validator,
			eventFactory,
			dateRangeCommandValidator,
			dateRangeValidator,
			dateRangeCommandFactory
		)
	})

	describe('date time paths', function() {
		it('shoulder render events page', async function() {
			const res: Response = mockRes()

			await eventController.getDateTime()(mockReq(), res)

			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/events')
		})

		it('should check for errors and redirect to event date time page', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			req.body = {
				day: '20',
				month: '12',
				year: '2030',
				startTime: ['09', '00'],
				endTime: ['17', '00'],
			}

			req.params.courseId = 'abc'
			req.params.moduleId = 'def'

			const dateRange = <DateRange>{}
			const dateRangeCommand = <DateRangeCommand>{}
			dateRangeCommand.asDateRange = sinon.stub().returns(dateRange)
			dateRangeCommandFactory.create = sinon.stub().returns(dateRangeCommand)
			dateRangeCommandValidator.check = sinon.stub().returns({fields: [], size: 0})
			dateRangeValidator.check = sinon.stub().returns({fields: [], size: 0})

			const event = new Event()
			eventFactory.create = sinon.stub().returns(event)

			await eventController.setDateTime()(req, res)

			expect(dateRangeCommandValidator.check).to.have.been.calledOnceWith(req.body)
			expect(res.render).to.have.been.calledWith('page/course/module/events/events', {
				event: event,
				eventJson: JSON.stringify(event),
			})
		})

		it('should render errors in DateRangeCommand', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			req.body = {
				day: '',
				month: '1',
				year: '2019',
				startTime: ['07', '00'],
				endTime: ['06', '00'],
			}

			const errors = {fields: {day: ['error']}, size: 1}
			dateRangeCommandValidator.check = sinon.stub().returns(errors)

			const event = new Event()
			eventFactory.create = sinon.stub().returns(event)

			await eventController.setDateTime()(req, res)

			expect(res.render).to.have.been.calledWith('page/course/module/events/events', {
				errors: errors,
				event: event,
				eventJson: JSON.stringify(event),
			})
		})

		it('should render errors in DateRange', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			req.body = {
				day: '',
				month: '1',
				year: '2019',
				startTime: ['07', '00'],
				endTime: ['06', '00'],
			}

			dateRangeCommandValidator.check = sinon.stub().returns({})

			const event = new Event()
			eventFactory.create = sinon.stub().returns(event)

			const errors = {fields: {day: ['error']}, size: 1}
			dateRangeValidator.check = sinon.stub().returns(errors)

			const dateRangeCommand = new DateRangeCommand()
			dateRangeCommand.startTime = ['09:00']
			dateRangeCommand.endTime = ['17:00']
			dateRangeCommandFactory.create = sinon.stub().returns(dateRangeCommand)

			await eventController.setDateTime()(req, res)

			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/events', {
				event: event,
				eventJson: JSON.stringify(event),
				errors: errors,
			})
		})

		it('should render event preview page', async function() {
			const response: Response = mockRes()

			const course: Course = new Course()
			const module: Module = new Module()

			learningCatalogue.getCourse = sinon.stub().returns(course)
			learningCatalogue.getModule = sinon.stub().returns(module)

			await eventController.getDatePreview()(mockReq(), response)

			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/events-preview')
		})
	})

	describe('location paths', function() {
		it('should render location pagefor add', async function() {
			const res: Response = mockRes()

			await eventController.getLocation()(mockReq(), res)
			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/event-location', {
				event: {},
				eventJson: undefined,
			})
		})

		it('should render location pagefor edit', async function() {
			const res: Response = mockRes()

			await eventController.getLocation()(mockReq(), res)
			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/event-location')
		})

		it('should create event and redirect to events overview page if no errors', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			req.params.courseId = 'course-id'
			req.params.moduleId = 'module-id'

			const venue = <Venue>{
				location: 'London',
				address: 'Victoria Street',
				capacity: 10,
				minCapacity: 5,
			}

			const event = new Event()

			req.body = {
				location: venue.location,
				address: venue.address,
				capacity: venue.capacity,
				minCapacity: venue.minCapacity,
				eventJson: JSON.stringify(event),
			}

			event.venue = venue

			eventValidator.check = sinon.stub().returns({fields: [], size: 0})
			learningCatalogue.createEvent = sinon.stub().returns(<Event>{
				id: 'event-id',
				venue: venue,
				dateRanges: [],
			})

			await eventController.setLocation()(req, res)

			expect(learningCatalogue.createEvent).to.have.been.calledOnceWith(
				req.params.courseId,
				req.params.moduleId,
				event
			)
			expect(res.redirect).to.have.been.calledOnceWith(
				`/content-management/courses/course-id/modules/module-id/events-overview/event-id`
			)
		})

		it('should update event and redirect to events overview page if no errors', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			req.params.courseId = 'course-id'
			req.params.moduleId = 'module-id'
			req.params.eventId = 'event-id'

			const venue = <Venue>{
				location: 'London',
				address: 'Victoria Street',
				capacity: 10,
				minCapacity: 5,
			}

			const event = <Event>{
				id: 'event-id',
				venue: {
					location: 'London',
					address: 'Victoria Street',
					capacity: 10,
					minCapacity: 5,
				},
				dateRanges: [
					{
						date: '2019-02-28',
						startTime: '09:00',
						endTime: '17:00',
					},
				],
			}

			req.body = {
				location: venue.location,
				address: venue.address,
				capacity: venue.capacity,
				minCapacity: venue.minCapacity,
			}

			event.venue = venue

			eventValidator.check = sinon.stub().returns({fields: [], size: 0})
			learningCatalogue.getEvent = sinon.stub().returns(event)
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.updateLocation()(req, res)

			expect(learningCatalogue.getEvent).to.have.been.calledOnceWith(
				req.params.courseId,
				req.params.moduleId,
				req.params.eventId
			)
			expect(learningCatalogue.updateEvent).to.have.been.calledOnceWith(
				req.params.courseId,
				req.params.moduleId,
				req.params.eventId,
				event
			)
			expect(res.redirect).to.have.been.calledOnceWith(
				`/content-management/courses/course-id/modules/module-id/events-overview/event-id`
			)
		})

		it('should redirect back to location page if errors on create', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			const event: Event = new Event()

			req.params.courseId = 'courseId123'
			req.params.moduleId = 'moduleId123'
			req.body = {
				// required field 'location' missing to imitate error condition
				eventJson: JSON.stringify(new Event()),
			}

			const errors = {fields: [{location: ['validation.module.event.venue.location.empty']}], size: 1}

			eventValidator.check = sinon.stub().returns(errors)

			learningCatalogue.createEvent = sinon.stub().returns(event)

			await eventController.setLocation()(req, res)

			expect(learningCatalogue.createEvent).to.not.have.been.called
			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/event-location', {
				eventJson: req.body.eventJson,
				errors: errors,
			})
		})

		it('should redirect back to location page if errors on update', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			const event: Event = new Event()
			event.id = 'event-id'

			req.params.courseId = 'courseId123'
			req.params.moduleId = 'moduleId123'
			req.body = {
				location: '',
				address: 'Victoria Street',
				capacity: 10,
				minCapacity: 5,
			}

			const errors = {fields: [{location: ['validation.module.event.venue.location.empty']}], size: 1}

			eventValidator.check = sinon.stub().returns(errors)

			learningCatalogue.createEvent = sinon.stub().returns(event)

			await eventController.updateLocation()(req, res)

			expect(learningCatalogue.createEvent).to.not.have.been.called
			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/event-location', {
				errors: errors,
				location: '',
				address: 'Victoria Street',
				capacity: 10,
				minCapacity: 5,
			})
		})
	})

	it('should render edit location page', async function() {
		const editLocation: (request: Request, response: Response) => void = eventController.editLocation()

		const request = mockReq()
		const response = mockRes()

		await editLocation(request, response)

		expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-location')
	})

	it('should render event overview page', async function() {
		const event: Event = new Event()
		event.dateRanges = [{date: '2019-02-01', startTime: '9:00:00', endTime: '17:00:00'}]

		const course: Course = new Course()
		const module: Module = new Module()

		const getEventOverview: (request: Request, response: Response) => void = eventController.getEventOverview()

		const request: Request = mockReq()
		const response: Response = mockRes()

		response.locals.event = event

		learnerRecord.getEventBookings = sinon.stub().returns([new Booking()])
		learningCatalogue.getCourse = sinon.stub().returns(course)
		learningCatalogue.getModule = sinon.stub().returns(module)

		await getEventOverview(request, response)

		expect(learnerRecord.getEventBookings).to.have.been.calledOnceWith(event.id)
		expect(response.render).to.have.been.calledWith('page/course/module/events/events-overview')
	})

	it('should render attendee details page', async function() {
		const date: string = '2020-02-01'
		const dateRange = new DateRange()
		dateRange.date = date

		const event: Event = new Event()
		event.dateRanges = [dateRange]

		const course: Course = new Course()
		const module: Module = new Module()

		const eventDateWithMonthAsText = DateTime.convertDate(event.dateRanges[0].date)

		const booking: Booking = new Booking()
		booking.id = 99
		const bookings = [booking]

		const getAttendeeDetails: (request: Request, response: Response) => void = eventController.getAttendeeDetails()

		const request: Request = mockReq()
		const response: Response = mockRes()

		response.locals.event = event

		request.params.bookingId = 99

		learnerRecord.getEventBookings = sinon.stub().returns(bookings)
		learningCatalogue.getCourse = sinon.stub().returns(course)
		learningCatalogue.getModule = sinon.stub().returns(module)

		await getAttendeeDetails(request, response)

		expect(learnerRecord.getEventBookings).to.have.been.calledOnceWith(event.id)
		expect(response.render).to.have.been.calledOnceWith('page/course/module/events/attendee', {
			booking,
			eventDateWithMonthAsText,
			course,
			module,
		})
	})

	it('should change booking status to confirmed and redirect to attendee page', async function() {
		const booking: Booking = new Booking()
		booking.id = 99
		const bookings = [booking]

		const registerLearner: (request: Request, response: Response) => void = eventController.updateBooking()

		const request: Request = mockReq()
		const response: Response = mockRes()

		request.params.courseId = 'courseId'
		request.params.moduleId = 'moduleId'
		request.params.eventId = 'eventId'
		request.params.bookingId = 99

		request.body.action = 'register'

		learnerRecord.updateBooking = sinon.stub()
		learnerRecord.getEventBookings = sinon.stub().returns(bookings)

		await registerLearner(request, response)

		expect(learnerRecord.getEventBookings).to.have.been.calledOnceWith('eventId')
		expect(response.redirect).to.have.been.calledOnceWith(
			`/content-management/courses/courseId/modules/moduleId/events/eventId/attendee/99`
		)
		expect(booking.status).to.be.equal(Booking.Status.CONFIRMED)
	})

	it('should change booking status to cancelled and redirect to event overview page', async function() {
		const booking: Booking = new Booking()
		booking.id = 99
		const bookings = [booking]

		const registerLearner: (request: Request, response: Response) => void = eventController.cancelBooking()

		const request: Request = mockReq()
		const response: Response = mockRes()

		request.params.courseId = 'courseId'
		request.params.moduleId = 'moduleId'
		request.params.eventId = 'eventId'
		request.params.bookingId = 99

		request.body.reason = 'cancel'

		learnerRecord.updateBooking = sinon.stub()
		learnerRecord.getEventBookings = sinon.stub().returns(bookings)
		validator.check = sinon.stub().returns({})

		await registerLearner(request, response)

		expect(learnerRecord.getEventBookings).to.have.been.calledOnceWith('eventId')
		expect(response.redirect).to.have.been.calledOnceWith(
			`/content-management/courses/courseId/modules/moduleId/events-overview/eventId`
		)
		expect(booking.status).to.be.equal(Booking.Status.CANCELLED)
	})

	it('should redirect to cancel attendee page if cancellation reason is not selected', async function() {
		const request: Request = mockReq()
		const response: Response = mockRes()

		request.session!.save = callback => {
			callback(undefined)
		}

		const registerLearner: (request: Request, response: Response) => void = eventController.cancelBooking()

		request.params.courseId = 'courseId'
		request.params.moduleId = 'moduleId'
		request.params.eventId = 'eventId'
		request.params.bookingId = 99

		request.body.reason = ''

		validator.check = sinon.stub().returns({fields: {reason: 'reason missing'}, size: 1})

		await registerLearner(request, response)

		expect(response.redirect).to.have.been.calledOnceWith(
			`/content-management/courses/courseId/modules/moduleId/events/eventId/attendee/99/cancel`
		)
	})

	it('should render cancel attendee page', async function() {
		let dateRange: DateRange = new DateRange()
		dateRange.date = '2018-01-02'

		const event: Event = new Event()
		event.id = 'eventId'
		event.dateRanges = [dateRange]

		const booking: Booking = new Booking()
		booking.id = 99

		const eventDateWithMonthAsText: string = DateTime.convertDate(event.dateRanges[0].date)

		const getCancelAttendee: (request: Request, response: Response) => void = eventController.getCancelBooking()

		const request: Request = mockReq()
		const response: Response = mockRes()

		response.locals.event = event
		request.params.bookingId = 99

		learnerRecord.getEventBookings = sinon.stub().returns([booking])

		await getCancelAttendee(request, response)

		expect(response.render).to.have.been.calledOnceWith('page/course/module/events/cancel-attendee', {
			booking: booking,
			eventDateWithMonthAsText: eventDateWithMonthAsText,
		})
	})

	describe('Edit and update DateRange', () => {
		it('should retrieve DateRange for edit', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: 0,
				},
			}

			let event = <Event>{
				id: 'event-id',
				venue: {
					location: 'London',
					address: 'London',
					minCapacity: 5,
					capacity: 10,
				},
				dateRanges: [
					{
						date: '2019-03-31',
						startTime: '09:15',
						endTime: '17:30',
					},
				],
			}

			const responseConfig = {
				locals: {
					event: event,
				},
			}

			// learningCatalogue.getEvent = sinon.stub().returns(event)

			const request = mockReq(requestConfig)
			const response = mockRes(responseConfig)

			await eventController.editDateRange()(request, response)

			// expect(learningCatalogue.getEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId)
			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit', {
				day: 31,
				month: 3,
				year: 2019,
				startHours: '09',
				startMinutes: '15',
				endHours: '17',
				endMinutes: '30',
				dateRangeIndex: 0,
			})
		})

		it('should update date range successfully', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: 0,
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: ['11', '30'],
					endTime: ['12', '30'],
				},
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const errors: any = {}

			const dateRange = <DateRange>{
				date: '2019-12-01',
				startTime: '11:30',
				endTime: '12:30',
			}

			let dateRangeCommand = <DateRangeCommand>{}
			dateRangeCommandValidator.check = sinon.stub().returns(errors)
			dateRangeCommandFactory.create = sinon.stub().returns(dateRangeCommand)
			dateRangeCommand.asDateRange = sinon.stub().returns(dateRange)

			dateRangeValidator.check = sinon.stub().returns(errors)

			const event = <Event>{
				id: 'event-id',
				venue: {
					address: 'London',
					location: 'London',
					minCapacity: 5,
					capacity: 5,
				},
				dateRanges: [],
			}
			learningCatalogue.getEvent = sinon.stub().returns(event)
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.updateDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId)
			expect(learningCatalogue.updateEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId, {
				id: 'event-id',
				venue: {
					address: 'London',
					location: 'London',
					minCapacity: 5,
					capacity: 5,
				},
				dateRanges: [
					{
						date: '2019-12-01',
						startTime: '11:30',
						endTime: '12:30',
					},
				],
			})
			expect(response.redirect).to.have.been.calledOnceWith(
				`/content-management/courses/${courseId}/modules/${moduleId}/events/${eventId}/dateRanges`
			)
		})

		it('should display errors if form validation fails on update', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'
			const dateRangeIndex = 0

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: dateRangeIndex,
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: ['11', '30'],
					endTime: ['12', '30'],
				},
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const errors: any = {
				fields: [
					{
						day: ['error'],
					},
				],
				size: 1,
			}

			dateRangeCommandValidator.check = sinon.stub().returns(errors)

			learningCatalogue.getEvent = sinon.stub()
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.updateDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.not.been.called
			expect(learningCatalogue.updateEvent).to.not.have.been.called
			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit', {
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
		})

		it('should display errors if DateRange validation fails on update', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'
			const dateRangeIndex = 0

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: dateRangeIndex,
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: ['11', '30'],
					endTime: ['12', '30'],
				},
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const errors: any = {
				fields: [
					{
						day: ['error'],
					},
				],
				size: 1,
			}

			dateRangeCommandValidator.check = sinon.stub().returns({})

			const dateRangeCommand = <DateRangeCommand>{}
			const dateRange = <DateRange>{}
			dateRangeCommandFactory.create = sinon.stub().returns(dateRangeCommand)
			dateRangeCommand.asDateRange = sinon.stub().returns(dateRange)
			dateRangeValidator.check = sinon.stub().returns(errors)

			learningCatalogue.getEvent = sinon.stub()
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.updateDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.not.been.called
			expect(learningCatalogue.updateEvent).to.not.have.been.called
			expect(dateRangeCommandValidator.check).to.have.been.calledOnceWith(request.body)
			expect(dateRangeCommandFactory.create).to.have.been.calledOnceWith(request.body)
			expect(dateRangeCommand.asDateRange).to.have.been.calledOnce
			expect(dateRangeValidator.check).to.have.been.calledOnceWith(dateRange)
			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit', {
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
		})

		it('should render dateRange overview', async () => {
			const request = mockReq()
			const response = mockRes()

			eventController.dateRangeOverview()(request, response)

			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit')
		})

		it('should add date range successfully', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: 0,
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: ['11', '30'],
					endTime: ['12', '30'],
				},
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const errors: any = {}

			const dateRange = <DateRange>{
				date: '2019-12-01',
				startTime: '11:30',
				endTime: '12:30',
			}

			let dateRangeCommand = <DateRangeCommand>{}
			dateRangeCommandValidator.check = sinon.stub().returns(errors)
			dateRangeCommandFactory.create = sinon.stub().returns(dateRangeCommand)
			dateRangeCommand.asDateRange = sinon.stub().returns(dateRange)

			dateRangeValidator.check = sinon.stub().returns(errors)

			const event = <Event>{
				id: 'event-id',
				venue: {
					address: 'London',
					location: 'London',
					minCapacity: 5,
					capacity: 5,
				},
				dateRanges: [
					{
						date: '2019-03-31',
						startTime: '09:30',
						endTime: '16:30',
					},
				],
			}
			learningCatalogue.getEvent = sinon.stub().returns(event)
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.addDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId)
			expect(learningCatalogue.updateEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId, {
				id: 'event-id',
				venue: {
					address: 'London',
					location: 'London',
					minCapacity: 5,
					capacity: 5,
				},
				dateRanges: [
					{
						date: '2019-03-31',
						startTime: '09:30',
						endTime: '16:30',
					},
					{
						date: '2019-12-01',
						startTime: '11:30',
						endTime: '12:30',
					},
				],
			})
			expect(response.redirect).to.have.been.calledOnceWith(
				`/content-management/courses/${courseId}/modules/${moduleId}/events/${eventId}/dateRanges`
			)
		})

		it('should display errors if form validation fails on add', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: ['11', '30'],
					endTime: ['12', '30'],
				},
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const errors: any = {
				fields: [
					{
						day: ['error'],
					},
				],
				size: 1,
			}

			dateRangeCommandValidator.check = sinon.stub().returns(errors)

			learningCatalogue.getEvent = sinon.stub()
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.addDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.not.been.called
			expect(learningCatalogue.updateEvent).to.not.have.been.called
			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit', {
				errors: errors,
				day: request.body.day,
				month: request.body.month,
				year: request.body.year,
				startHours: request.body.startHours,
				startMinutes: request.body.startMinutes,
				endHours: request.body.endHours,
				endMinutes: request.body.endMinutes,
			})
		})

		it('should display errors if DateRange validation fails on add', async () => {
			const courseId = 'course-id'
			const moduleId = 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: ['11', '30'],
					endTime: ['12', '30'],
				},
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const errors: any = {
				fields: [
					{
						day: ['error'],
					},
				],
				size: 1,
			}

			dateRangeCommandValidator.check = sinon.stub().returns({})

			const dateRangeCommand = <DateRangeCommand>{}
			const dateRange = <DateRange>{}
			dateRangeCommandFactory.create = sinon.stub().returns(dateRangeCommand)
			dateRangeCommand.asDateRange = sinon.stub().returns(dateRange)
			dateRangeValidator.check = sinon.stub().returns(errors)

			learningCatalogue.getEvent = sinon.stub()
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.addDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.not.been.called
			expect(learningCatalogue.updateEvent).to.not.have.been.called
			expect(dateRangeCommandValidator.check).to.have.been.calledOnceWith(request.body)
			expect(dateRangeCommandFactory.create).to.have.been.calledOnceWith(request.body)
			expect(dateRangeCommand.asDateRange).to.have.been.calledOnce
			expect(dateRangeValidator.check).to.have.been.calledOnceWith(dateRange)
			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit', {
				errors: errors,
				day: request.body.day,
				month: request.body.month,
				year: request.body.year,
				startHours: request.body.startHours,
				startMinutes: request.body.startMinutes,
				endHours: request.body.endHours,
				endMinutes: request.body.endMinutes,
			})
		})
	})
})
