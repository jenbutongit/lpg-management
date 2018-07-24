import {Course} from '../../../src/learning-catalogue/model/course'
import {CourseFactory} from '../../../src/learning-catalogue/model/factory/courseFactory'
import {LearningCatalogue} from '../../../src/learning-catalogue/'
import {beforeEach, describe, it} from 'mocha'
import {AxiosInstance} from 'axios'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {expect} from 'chai'
import {LearningCatalogueConfig} from '../../../src/learning-catalogue/learningCatalogueConfig'
chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Learning Catalogue tests', () => {
	let http: AxiosInstance
	let courseFactory: CourseFactory
	let learningCatalogue: LearningCatalogue
	let config: LearningCatalogueConfig = new LearningCatalogueConfig(
		'username',
		'password',
		'url'
	)

	beforeEach(() => {
		http = <AxiosInstance>{}
		courseFactory = <CourseFactory>{}
		learningCatalogue = new LearningCatalogue(http, config)
		learningCatalogue.courseFactory = courseFactory
	})

	it('should convert learning catalogue response to paged list of courses', () => {
		const response = {
			data: {
				results: [
					{
						id: 'abc',
					},
					{
						id: 'def',
					},
				],
				page: 0,
				totalResults: 32,
				size: 10,
			},
		}

		const get = sinon.stub()
		get
			.withArgs(`${config.url}/courses?page=0&size=10`, {
				auth: {
					username: config.username,
					password: config.password,
				},
			})
			.returns(
				new Promise(resolve => {
					resolve(response)
				})
			)

		http.get = get

		const course1: Course = new Course()
		course1.id = 'abc'

		const course2: Course = new Course()
		course2.id = 'def'

		const create = sinon.stub()
		create
			.withArgs({
				id: 'abc',
			})
			.returns(course1)
		create
			.withArgs({
				id: 'def',
			})
			.returns(course2)

		courseFactory.create = create

		return learningCatalogue.listAll().then(result => {
			expect(create).to.have.been.calledTwice
			expect(result.results).to.eql([course1, course2])
			expect(result.page).to.eql(0)
			expect(result.size).to.eql(10)
			expect(result.totalResults).to.eql(32)
			expect(get).to.have.been.calledOnceWith(
				`${config.url}/courses?page=0&size=10`,
				{
					auth: {
						username: config.username,
						password: config.password,
					},
				}
			)
		})
	})

	it('should pass page parameters to http call', () => {
		const page: number = 2
		const size: number = 99

		const response = {
			data: {
				results: [],
				page: 0,
				totalResults: 32,
				size: 10,
			},
		}

		http.get = sinon.stub().returns(
			new Promise(resolve => {
				resolve(response)
			})
		)

		courseFactory.create = sinon.stub()

		return learningCatalogue.listAll(page, size).then(result => {
			expect(http.get).to.have.been.calledOnceWith(
				`${config.url}/courses?page=${page}&size=${size}`,
				{
					auth: {
						username: config.username,
						password: config.password,
					},
				}
			)
		})
	})

	it('should return empty list of results if results are null', () => {
		const response = {
			data: {
				results: null,
				page: 0,
				totalResults: 32,
				size: 10,
			},
		}

		const get = sinon
			.stub()
			.returns(
				new Promise((resolve, reject) => {
					resolve(response)
				})
			)
			.withArgs('/courses')

		http.get = get

		const create = sinon.stub()
		courseFactory.create = create

		return learningCatalogue.listAll().then(result => {
			expect(create).to.not.have.been.called
			expect(result.results).to.eql([])
			expect(result.page).to.eql(0)
			expect(result.size).to.eql(10)
			expect(result.totalResults).to.eql(32)
		})
	})

	it('Should throw error if there is a problem with request to learning catalogue', async () => {
		const error: Error = new Error('Error thrown from stub')

		const get = sinon.stub().throws(error)

		http.get = get

		return await expect(learningCatalogue.listAll()).to.be.rejectedWith(
			`Error listing all courses - ${error}`
		)
	})
})
