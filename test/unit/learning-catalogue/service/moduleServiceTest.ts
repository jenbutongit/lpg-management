import {ModuleService} from '../../../../src/learning-catalogue/service/moduleService'
import {beforeEach, describe, it} from 'mocha'
import {LearningCatalogueConfig} from '../../../../src/learning-catalogue/learningCatalogueConfig'
import {AxiosInstance, AxiosResponse} from 'axios'
import {Module} from '../../../../src/learning-catalogue/model/module'
import * as sinonChai from 'sinon-chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import {expect} from 'chai'
import * as chai from 'chai'
import {ModuleFactory} from '../../../../src/learning-catalogue/model/factory/moduleFactory'
chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('ModuleService tests', () => {
	const courseId = 'course-id'
	let moduleService: ModuleService
	let http: AxiosInstance
	let moduleFactory: ModuleFactory

	let config: LearningCatalogueConfig = <LearningCatalogueConfig>{
		username: 'test-user',
		password: 'test-pass',
		url: 'http://example.org',
	}

	const url: string = `${config.url}/courses/${courseId}/modules`

	beforeEach(() => {
		moduleFactory = <ModuleFactory>{}
		http = <AxiosInstance>{}
		moduleService = new ModuleService(http, config)
		moduleService.moduleFactory = moduleFactory
	})

	it('should get module', async () => {
		const moduleId: string = 'module-id'
		const module = <Module>{
			id: moduleId,
		}

		const data = {
			id: moduleId,
		}

		const getResponse: AxiosResponse = <AxiosResponse>{
			data: data,
		}

		http.get = sinon
			.stub()
			.withArgs(`${url}${moduleId}`, {
				auth: {
					username: config.username,
					password: config.password,
				},
			})
			.returns(getResponse)

		const create = sinon
			.stub()
			.withArgs(data)
			.returns(module)

		moduleFactory.create = create

		return expect(await moduleService.get(courseId, moduleId)).to.eql(
			module
		)
	})

	it('should create module', async () => {
		const moduleId: string = 'module-id'
		const module = <Module>{
			id: moduleId,
		}

		const postResponse: AxiosResponse = <AxiosResponse>{
			headers: {
				location: `${
					config.url
				}/courses/${courseId}/modules/${moduleId}`,
			},
		}

		const data = {
			id: moduleId,
		}

		const getResponse: AxiosResponse = <AxiosResponse>{
			data: data,
		}

		http.post = sinon
			.stub()
			.withArgs(url, module, {
				auth: {
					username: config.username,
					password: config.password,
				},
			})
			.returns(postResponse)

		http.get = sinon
			.stub()
			.withArgs(`${url}${moduleId}`, {
				auth: {
					username: config.username,
					password: config.password,
				},
			})
			.returns(getResponse)

		const create = sinon
			.stub()
			.withArgs(data)
			.returns(module)

		moduleFactory.create = create

		return expect(await moduleService.create(courseId, module)).to.eql(
			module
		)
	})

	it('Should throw error if there is a problem with GET request to learning catalogue', async () => {
		const moduleId = 'module-id'

		const error: Error = new Error('Error thrown from stub')

		const get = sinon.stub().throws(error)

		http.get = get

		return await expect(
			moduleService.get(courseId, moduleId)
		).to.be.rejectedWith(
			`Error retrieving module (module-id) of course: course-id: ${error}`
		)
	})

	it('Should throw error if there is a problem with POST request to learning catalogue', async () => {
		const error: Error = new Error('Error thrown from stub')

		const post = sinon.stub().throws(error)

		http.post = post

		return await expect(
			moduleService.create(courseId, <Module>{})
		).to.be.rejectedWith(`Error creating course: ${error}`)
	})
})
