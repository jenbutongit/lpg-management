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

chai.use(sinonChai)

describe('Home Controller Tests', function() {
	const lpgUiUrl = 'localhost'

	let homeController: HomeController
	let learningCatalogue: LearningCatalogue
	beforeEach(() => {
		learningCatalogue = <LearningCatalogue>{}
		homeController = new HomeController(learningCatalogue, lpgUiUrl)
	})

	it('should render index template', async function() {
		const course: Course = new Course()
		course.id = 'course-id'
		course.title = 'course-title'

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

		expect(response.render).to.have.been.calledOnceWith('page/index', {
			pageResults,
			lpgUiUrl: lpgUiUrl,
		})
	})
})
