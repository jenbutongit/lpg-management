import {beforeEach, describe, it} from 'mocha'
import {HomeController} from '../../../src/controllers/homeController'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {expect} from 'chai'
import {Request, Response} from 'express'
import {LearningCatalogue} from '../../../src/learning-catalogue'
import {Course} from '../../../src/learning-catalogue/model/course'
import * as sinon from 'sinon'
import {PageResults} from '../../../src/learning-catalogue/model/pageResults'
import {CourseRequest} from '../../../src/extended'

chai.use(sinonChai)

describe('Home Controller Tests', function() {
	const lpgUiUrl = 'localhost'

	let homeController: HomeController
	let learningCatalogue: LearningCatalogue
	beforeEach(() => {
		learningCatalogue = <LearningCatalogue>{}
		homeController = new HomeController(learningCatalogue, lpgUiUrl)
	})

	it('should render index template with default page and size', async function() {
		const course: Course = new Course()
		course.id = 'courseOverview-id'
		course.title = 'courseOverview-title'

		const pageResults: PageResults<Course> = {
			page: 0,
			size: 10,
			totalResults: 21,
			results: [course],
		} as PageResults<Course>

		const listAll = sinon.stub().returns(Promise.resolve(pageResults))
		learningCatalogue.listAll = listAll

		const index: (
			request: Request,
			response: Response
		) => void = homeController.index()

		const request: Request = mockReq()
		const response: Response = mockRes()
		await index(request, response)

		expect(learningCatalogue.listAll).to.have.been.calledWith(0, 10)

		expect(response.render).to.have.been.calledOnceWith('page/index')
	})

	it('should call learning catalogue with correct page and size', async function() {
		const course: Course = new Course()
		course.id = 'courseOverview-id'
		course.title = 'courseOverview-title'

		const pageResults: PageResults<Course> = {
			page: 0,
			size: 10,
			totalResults: 21,
			results: [course],
		} as PageResults<Course>

		const listAll = sinon.stub().returns(Promise.resolve(pageResults))
		learningCatalogue.listAll = listAll

		const index: (
			request: Request,
			response: Response
		) => void = homeController.index()

		const request: Request = mockReq()
		const response: Response = mockRes()

		request.query.p = 3
		request.query.s = 5

		await index(request, response)

		expect(learningCatalogue.listAll).to.have.been.calledWith(3, 5)

		expect(response.render).to.have.been.calledOnceWith('page/index', {
			pageResults,
			lpgUiUrl: lpgUiUrl,
		})
	})

	it('should call course overview page', async function() {
		const course: Course = new Course()
		course.id = 'courseOverview-id'
		course.title = 'courseOverview-title'

		const courseOverview: (
			request: Request,
			response: Response
		) => void = homeController.courseOverview()

		const request: Request = mockReq()
		const response: Response = mockRes()

		const req = request as CourseRequest
		req.course = course

		await courseOverview(req, response)

		expect(response.render).to.have.been.calledOnceWith('page/course', {
			course,
		})
	})
})
