import {Course} from '../../../src/learning-catalogue/model/course'
import {LearningCatalogue} from '../../../src/learning-catalogue/'
import {beforeEach, describe, it} from 'mocha'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {CourseService} from '../../../src/learning-catalogue/service/courseService'
import {ModuleService} from '../../../src/learning-catalogue/service/moduleService'
import {Module} from '../../../src/learning-catalogue/model/module'
import {RestService} from '../../../src/learning-catalogue/service/restService'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Learning Catalogue tests', () => {
	let learningCatalogue: LearningCatalogue
	let courseService: CourseService
	let moduleService: ModuleService

	beforeEach(() => {
		courseService = <CourseService>{}
		moduleService = <ModuleService>{}

		learningCatalogue = new LearningCatalogue(<RestService>{})
		learningCatalogue.courseService = courseService
		learningCatalogue.moduleService = moduleService
	})

	it('should call courseService when creating a course', async () => {
		const course: Course = <Course>{}
		courseService.create = sinon.stub()

		await learningCatalogue.createCourse(course)
		return expect(courseService.create).to.have.been.calledOnceWith(course)
	})

	it('should call courseService when getting a course', async () => {
		const courseId: string = 'course-id'
		courseService.get = sinon.stub()

		await learningCatalogue.getCourse(courseId)
		return expect(courseService.get).to.have.been.calledOnceWith(courseId)
	})

	it('should call courseService when listing courses', async () => {
		courseService.listAll = sinon.stub()

		await learningCatalogue.listCourses()
		return expect(courseService.listAll).to.have.been.calledOnce
	})

	it('should call moduleService when creating a module', async () => {
		const courseId: string = 'course-id'
		const module: Module = <Module>{}
		moduleService.create = sinon.stub()

		await learningCatalogue.createModule(courseId, module)
		return expect(moduleService.create).to.have.been.calledOnceWith(
			courseId,
			module
		)
	})

	it('should call moduleService when getting a module', async () => {
		const courseId: string = 'course-id'
		const moduleId: string = 'module-id'
		moduleService.get = sinon.stub()

		await learningCatalogue.getModule(courseId, moduleId)
		return expect(moduleService.get).to.have.been.calledOnceWith(
			courseId,
			moduleId
		)
	})
})
