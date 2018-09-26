import {describe} from 'mocha'
import {CourseService} from '../../../src/lib/courseService'
import {Course} from '../../../src/learning-catalogue/model/course'
import {Module} from '../../../src/learning-catalogue/model/module'
import {expect} from 'chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

describe('CourseService tests', () => {
	let learningCatalogue: any = {}
	let courseService: CourseService

	before(() => {
		courseService = new CourseService(learningCatalogue)
	})

	it('should get course sort modules and save course', async () => {
		const courseId = 'course-id'

		const module1: Module = new Module()
		module1.id = '1'

		const module2: Module = new Module()
		module2.id = '2'

		const module3: Module = new Module()
		module3.id = '3'

		let course: Course = new Course()
		course.modules = [module1, module2, module3]

		learningCatalogue.getCourse = sinon
			.stub()
			.withArgs(courseId)
			.returns(course)
		learningCatalogue.updateCourse = sinon
			.stub()
			.withArgs(courseId)
			.returns(course)

		expect(course.modules.map(m => m.id)).to.be.eql(['1', '2', '3'])

		const sortedCourse = await courseService.sortModules(courseId, ['3', '2', '1'])

		expect(sortedCourse.modules.map(m => m.id)).to.be.eql(['3', '2', '1'])
	})

	it('should throw error if module id does not exist in course', async () => {
		const courseId = 'course-id'

		const module1: Module = new Module()
		module1.id = '1'

		const module2: Module = new Module()
		module2.id = '2'

		const module3: Module = new Module()
		module3.id = '3'

		let course: Course = new Course()
		course.modules = [module1, module2, module3]

		learningCatalogue.getCourse = sinon
			.stub()
			.withArgs(courseId)
			.returns(course)
		learningCatalogue.updateCourse = sinon
			.stub()
			.withArgs(courseId)
			.returns(course)

		return expect(courseService.sortModules(courseId, ['4', '2', '1'])).to.be.rejectedWith(
			'Module (id: 4) not found in course (id: course-id)'
		)
	})

	it('should throw error if length of modules and module ids does not match', async () => {
		const courseId = 'course-id'

		const module1: Module = new Module()
		module1.id = '1'

		const module2: Module = new Module()
		module2.id = '2'

		const module3: Module = new Module()
		module3.id = '3'

		let course: Course = new Course()
		course.modules = [module1, module2, module3]

		learningCatalogue.getCourse = sinon
			.stub()
			.withArgs(courseId)
			.returns(course)
		learningCatalogue.updateCourse = sinon
			.stub()
			.withArgs(courseId)
			.returns(course)

		return expect(courseService.sortModules(courseId, ['3', '2'])).to.be.rejectedWith(
			'Course modules length(3) does not match module ids length(2)'
		)
	})
})
