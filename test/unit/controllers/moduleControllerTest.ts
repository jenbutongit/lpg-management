import {beforeEach, describe, it} from 'mocha'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {expect} from 'chai'
import {Request, Response} from 'express'
import {LearningCatalogue} from 'src/learning-catalogue'
import {ModuleController} from 'src/controllers/moduleController'
import {ModuleFactory} from 'src/learning-catalogue/model/factory/moduleFactory'

chai.use(sinonChai)

describe('Module Controller Tests', function() {
	let moduleController: ModuleController
	let learningCatalogue: LearningCatalogue
	let moduleFactory: ModuleFactory

	beforeEach(() => {
		learningCatalogue = <LearningCatalogue>{}

		moduleFactory = <ModuleFactory>{}

		moduleController = new ModuleController(learningCatalogue, moduleFactory)
	})

	it('should call add module page', async function() {
		const addModule: (request: Request, response: Response) => void = moduleController.addModule()

		const request: Request = mockReq()
		const response: Response = mockRes()

		await addModule(request, response)

		expect(response.render).to.have.been.calledOnceWith('page/course/module/add-module')
	})

	it('should call add module type page', async function() {
		const setModule: (request: Request, response: Response) => void = moduleController.setModule()

		const request: Request = mockReq()
		const response: Response = mockRes()

		request.body = {module: 'blog'}

		await setModule(request, response)
		//To be done - would expect to render form for specific module type
		expect(response.render).to.have.been.calledOnceWith('page/course/module/add-module')
	})
})
