import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {beforeEach} from 'mocha'
import {EventController} from '../../../../../src/controllers/module/event/eventController'
import {LearningCatalogue} from '../../../../../src/learning-catalogue'
import {Validator} from '../../../../../src/learning-catalogue/validator/validator'
import {Event} from '../../../../../src/learning-catalogue/model/event'
import {EventFactory} from '../../../../../src/learning-catalogue/model/factory/eventFactory'
import {mockReq, mockRes} from 'sinon-express-mock'
import {Request, Response} from 'express'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {Module} from '../../../../../src/learning-catalogue/model/module'
import {DateRange} from '../../../../../src/learning-catalogue/model/dateRange'
import {DateRangeCommand} from '../../../../../src/controllers/command/dateRangeCommand'
import {DateRangeCommandFactory} from '../../../../../src/controllers/command/factory/dateRangeCommandFactory'

chai.use(sinonChai)

describe('EventController', function() {
	let eventController: EventController
	let learningCatalogue: LearningCatalogue
	let eventValidator: Validator<Event>
	let eventFactory: EventFactory
	let dateRangeCommandValidator: Validator<DateRangeCommand>
	let dateRangeValidator: Validator<DateRange>
	let dateRangeCommandFactory: DateRangeCommandFactory

	beforeEach(() => {
		learningCatalogue = <LearningCatalogue>{}
		eventValidator = <Validator<Event>>{}
		eventFactory = <EventFactory>{}
		dateRangeCommandValidator = <Validator<DateRangeCommand>>{}
		dateRangeValidator = <Validator<DateRange>>{}
		dateRangeCommandFactory = <DateRangeCommandFactory>{}

		eventController = new EventController(learningCatalogue, eventValidator, eventFactory, dateRangeCommandValidator, dateRangeValidator, dateRangeCommandFactory)
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
				'start-date-day': '20',
				'start-date-month': '12',
				'start-date-year': '2030',
				'start-time': ['09', '00'],
				'end-time': ['17', '00'],
			}

			req.params.courseId = 'abc'
			req.params.moduleId = 'def'

			const event: Event = new Event()
			event.dateRanges = [new DateRange()]
			req.session!.event = event

			eventFactory.create = sinon.stub().returns(event)
			eventValidator.check = sinon.stub().returns({fields: [], size: 0})

			req.session!.save = callback => {
				callback(undefined)
			}
			await eventController.setDateTime()(req, res)

			expect(eventValidator.check).to.have.been.calledOnce
			expect(eventFactory.create).to.have.been.calledOnce
			expect(res.redirect).to.have.been.calledWith('/content-management/courses/abc/modules/def/events')
		})

		it('should check for errors and redirect to events page', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			req.body = {
				'start-date-day': '',
				'start-date-month': '',
				'start-date-year': '',
				'start-time': ['07', '00'],
				'end-time': ['06', '00'],
			}

			req.params.courseId = 'abc'
			req.params.moduleId = 'def'

			eventFactory.create = sinon.stub().returns(new Event())
			eventValidator.check = sinon.stub().returns({fields: ['validation.module.event.dateRanges.empty'], size: 1})
			learningCatalogue.createEvent = sinon.stub().returns(new Module())

			req.session!.save = callback => {
				callback(undefined)
			}
			await eventController.setDateTime()(req, res)

			expect(eventValidator.check).to.have.been.calledOnce
			expect(eventFactory.create).to.have.been.calledOnce
			expect(res.redirect).to.have.been.calledWith(`/content-management/courses/abc/modules/def/events`)
		})

		it('should render event preview page', async function() {
			const response: Response = mockRes()

			await eventController.getDatePreview()(mockReq(), response)

			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/events-preview')
		})
	})

	describe('location paths', function() {
		it('should render location page', async function() {
			const res: Response = mockRes()

			await eventController.getLocation()(mockReq(), res)
			expect(res.render).to.have.been.calledOnceWith('page/course/module/events/event-location')
		})

		it('should check for errors and redirect to events overview page if no errors', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			const event: Event = new Event()
			event.id = 'eventId123'

			req.params.courseId = 'courseId123'
			req.params.moduleId = 'moduleId123'
			req.body = {
				location: 'London',
			}
			req.session!.event = event

			eventFactory.create = sinon.stub().returns(new Event())
			eventValidator.check = sinon.stub().returns({fields: [], size: 0})
			learningCatalogue.createEvent = sinon.stub().returns(event)

			req.session!.save = callback => {
				callback(undefined)
			}
			await eventController.setLocation()(req, res)

			expect(learningCatalogue.createEvent).to.have.been.calledOnceWith(
				req.params.courseId,
				req.params.moduleId,
				event
			)
			expect(res.redirect).to.have.been.calledOnceWith(
				'/content-management/courses/courseId123/modules/moduleId123/events-overview/eventId123'
			)
		})

		it('should redirect to events page if event object not found on session', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			const event: Event = new Event()
			event.id = 'eventId123'

			req.params.courseId = 'courseId123'
			req.params.moduleId = 'moduleId123'
			req.body = {
				location: 'London',
			}

			eventFactory.create = sinon.stub().returns(new Event())
			eventValidator.check = sinon.stub().returns({fields: [], size: 0})
			learningCatalogue.createEvent = sinon.stub().returns(event)

			req.session!.save = callback => {
				callback(undefined)
			}
			await eventController.setLocation()(req, res)

			expect(learningCatalogue.createEvent).to.not.have.been.called
			expect(res.redirect).to.have.been.calledOnceWith(
				'/content-management/courses/courseId123/modules/moduleId123/events'
			)
		})

		it('should check for errors and redirect back to location page if errors', async function() {
			const req: Request = mockReq()
			const res: Response = mockRes()

			const event: Event = new Event()
			event.id = 'eventId123'

			req.params.courseId = 'courseId123'
			req.params.moduleId = 'moduleId123'
			req.body = {
				// required field 'location' missing to imitate error condition
			}
			req.session!.event = event

			eventFactory.create = sinon.stub().returns(new Event())
			eventValidator.check = sinon
				.stub()
				.returns({fields: [{location: ['validation.module.event.venue.location.empty']}], size: 1})
			learningCatalogue.createEvent = sinon.stub().returns(event)

			req.session!.save = callback => {
				callback(undefined)
			}
			await eventController.setLocation()(req, res)

			expect(learningCatalogue.createEvent).to.not.have.been.called
			expect(res.redirect).to.have.been.calledOnceWith(
				'/content-management/courses/courseId123/modules/moduleId123/events/location'
			)
		})
	})

	it('should render event overview page', async function() {
		let event: Event = new Event()
		event.dateRanges = [{date: '2019-02-01', startTime: '9:00:00', endTime: '17:00:00'}]

		const getEventOverview: (request: Request, response: Response) => void = eventController.getEventOverview()

		const request: Request = mockReq()
		const response: Response = mockRes()

		response.locals.event = event

		await getEventOverview(request, response)

		expect(response.render).to.have.been.calledWith('page/course/module/events/events-overview')
	})

	describe('Edit and update DateRange', () => {
		it('should retrieve DateRange for edit', async () => {
			const courseId = 'course-id'
			const moduleId= 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: 0
				}
			}

			const dateRange = new DateRange()
			dateRange.date = '2019-03-31'
			dateRange.startTime = '09:15'
			dateRange.endTime = '17:30'

			const event = <Event>{}
			event.dateRanges = [dateRange]
			learningCatalogue.getEvent = sinon.stub().returns(event)


			const request = mockReq(requestConfig)
			const response = mockRes()

			await eventController.editDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId)
			expect(response.render).to.have.been.calledOnceWith('page/course/module/events/event-dateRange-edit', {
				day: 31,
				month : 3,
				year: 2019,
				startHours: '09',
				startMinutes: '15',
				endHours: '17',
				endMinutes: '30'
			})
		})

		it('should update event successfully', async () => {
			const courseId = 'course-id'
			const moduleId= 'module-id'
			const eventId = 'event-id'

			const requestConfig = {
				params: {
					courseId: courseId,
					moduleId: moduleId,
					eventId: eventId,
					dateRangeIndex: 0
				},
				body: {
					day: '01',
					month: '12',
					year: '2019',
					startTime: [ '11', '30'],
					endTime: ['12', '30'],
				}
			}

			const request = mockReq(requestConfig)
			const response = mockRes()

			const event = <Event>{}
			const dateRange = new DateRange()
			dateRange.date = '2019-03-31'
			dateRange.startTime = '09:00'
			dateRange.endTime = '17:00'

			event.dateRanges = [dateRange]

			learningCatalogue.getEvent = sinon.stub().returns(event)
			learningCatalogue.updateEvent = sinon.stub()

			await eventController.updateDateRange()(request, response)

			expect(learningCatalogue.getEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId)
			expect(learningCatalogue.updateEvent).to.have.been.calledOnceWith(courseId, moduleId, eventId, {
				dateRanges: [
					{
						date: '2019-12-01',
						startTime: '11:30',
						endTime: '12:30'
					}
				]
			})
			expect(response.redirect).to.have.been.calledOnceWith(`/content-management/courses/${courseId}/modules/${moduleId}/events/${eventId}`)

		})

	})
})
