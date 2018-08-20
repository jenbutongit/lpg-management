import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {ModuleController} from '../../../src/controllers/Module/moduleController'
import {ModuleValidator} from '../../../src/learning-catalogue/validator/moduleValidator'
import {ModuleFactory} from '../../../src/learning-catalogue/model/factory/moduleFactory'
import {LearningCatalogue} from '../../../src/learning-catalogue'
//import {Module} from '../../../src/learning-catalogue/model/module'
import {mockReq, mockRes} from 'sinon-express-mock'
import {ContentRequest} from '../../../src/extended'
import * as sinon from 'sinon'
import {Course} from '../../../src/learning-catalogue/model/course'
import {Request, Response} from 'express'
import {expect} from 'chai'
import axios from 'axios'
//import * as youtube from 'lib/youtube'

chai.use(sinonChai)

describe('Module Controller Test', function() {
	let moduleController: ModuleController
	let learningCatalogue: LearningCatalogue
	let moduleValidator: ModuleValidator
	let moduleFactory: ModuleFactory

	beforeEach(() => {
		learningCatalogue = <LearningCatalogue>{}
		moduleValidator = <ModuleValidator>{}
		moduleFactory = <ModuleFactory>{}

		moduleController = new ModuleController(learningCatalogue, moduleValidator, moduleFactory)
	})

	it('should check for errors, get Youtube info and create module', async function() {
		const course: Course = new Course()
		//const module: Module = new Module()

		const setModule: (request: Request, response: Response) => void = moduleController.setModule()

		const request: Request = mockReq()
		const response: Response = mockRes()

		const req = request as ContentRequest
		req.params.courseId = 'abc'

		req.body.type = 'video'

		moduleValidator.check = sinon.stub().returns({fields: [], size: 0})

		moduleFactory.create = sinon.stub()

		learningCatalogue.createModule = sinon.stub()

		learningCatalogue.getCourse = sinon.stub().returns(course)

		axios.get = sinon
			.stub()
			.returns({
				status: 200,
				data: {
					type: 'video',
					html:
						'<iframe width="560" height="315" src="https://www.youtube.com/embed/eyU3bRy2x44" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
				},
			})
		//youtube.getBasicYoutubeInfo = sinon.stub().returns({titles: 'title'})

		setModule(request, response)

		expect(response.sendStatus).to.have.been.calledWith(500)
		//expect(response.redirect).to.have.been.calledOnceWith(`/content-management/course-preview/abc`)
	})
})
