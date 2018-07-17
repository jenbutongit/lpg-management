import {Course} from '../../../src/learning-catalogue/model/course'
import {CourseFactory} from '../../../src/learning-catalogue/model/factory/courseFactory'
import {LearningCatalogue} from '../../../src/learning-catalogue/'
import {beforeEach, describe, it} from 'mocha'
import {AxiosInstance} from 'axios'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {expect} from 'chai'
chai.use(chaiAsPromised)
// chai.use(sinonChai)

describe('Learning Catalogue tests', () => {
	let http: AxiosInstance
	let courseFactory: CourseFactory
	let learningCatalogue: LearningCatalogue

	beforeEach(() => {
		http = <AxiosInstance>{}
		courseFactory = <CourseFactory>{}
		learningCatalogue = new LearningCatalogue(http, courseFactory)
	})

	it('should convert learning catalogue response to paged list of courses', done => {
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

		const get = sinon
			.stub()
			.returns(
				new Promise((resolve, reject) => {
					resolve(response)
				})
			)
			.withArgs('/courses')

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

		expect(learningCatalogue.listAll())
			.to.eventually.eql([course1, course2])
			.notify(done)
	})
})
