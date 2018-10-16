import {beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'
import {Course} from '../../../../src/learning-catalogue/model/course'
import {VideoModule} from '../../../../src/learning-catalogue/model/videoModule'
import {LinkModule} from '../../../../src/learning-catalogue/model/linkModule'
import {FaceToFaceModule} from '../../../../src/learning-catalogue/model/faceToFaceModule'
import {Module} from '../../../../src/learning-catalogue/model/module'

describe('Course tests', () => {
	let course: Course

	beforeEach(() => {
		course = new Course()
	})

	it('should be able to set id', () => {
		course.id = 'test-id'
		expect(course.id).to.equal('test-id')
	})

	it('should be able to set title', () => {
		course.title = 'test-title'
		expect(course.title).to.equal('test-title')
	})

	it('should be able to set shortDescription', () => {
		course.shortDescription = 'test-shortDescription'
		expect(course.shortDescription).to.equal('test-shortDescription')
	})

	it('should be able to set description', () => {
		course.description = 'test-description'
		expect(course.description).to.equal('test-description')
	})

	it('should be able to set duration', () => {
		course.duration = 999
		expect(course.duration).to.equal(999)
	})

	it('should be able to set learningOutcomes', () => {
		course.learningOutcomes = 'test-learningOutcomes'
		expect(course.learningOutcomes).to.equal('test-learningOutcomes')
	})

	it('should be able to set modules', () => {
		const modules = [new Module()]

		course.modules = modules

		expect(course.modules).to.equal(modules)
	})

	describe('#getCost', () => {
		let module1: VideoModule
		let module2: LinkModule
		let module3: FaceToFaceModule

		beforeEach(() => {
			module1 = new VideoModule()
			module2 = new LinkModule()
			module3 = new FaceToFaceModule()
			course.modules = [module1, module2, module3]
		})

		it('should be able to get cost by sum of module costs', () => {
			module1.cost = 100
			module2.cost = 50
			module3.cost = 25.25

			expect(course.getCost()).to.equal(175.25)
		})

		it('should get undefined if there are no modules', () => {
			course.modules = []

			expect(course.getCost()).to.be.undefined
		})

		it('should get undefined if all module costs are undefined', () => {
			module1.cost = undefined
			module2.cost = undefined
			module3.cost = undefined

			expect(course.getCost()).to.be.undefined
		})

		it('should get cost if some module costs are undefined but some have a cost', () => {
			module1.cost = undefined
			module2.cost = 50
			module3.cost = undefined

			expect(course.getCost()).to.equal(50)
		})

		it('should get 0 if all module costs are 0', () => {
			module1.cost = 0
			module2.cost = 0
			module3.cost = 0

			expect(course.getCost()).to.equal(0)
		})
	})

	it('should get type to be null if no modules', () => {
		course.modules = []

		expect(course.getType()).to.equal('course')
	})

	it('should get type to be blended if more than one module', () => {
		course.modules = [new Module(), new Module(), new Module()]

		expect(course.getType()).to.equal('blended')
	})

	it('should get type to be type of module if only one module', () => {
		const module1 = new Module()
		module1.type = Module.Type.VIDEO

		course.modules = [module1]

		expect(course.getType()).to.equal('video')
	})
})
