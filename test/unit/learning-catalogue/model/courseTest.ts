import {Course} from '../../../../src/learning-catalogue/model/course'
import {beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'
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

	it('should be able to set price', () => {
		course.price = 1000
		expect(course.price).to.equal(1000)
	})

	it('should be able to set modules', () => {
		const modules = [new Module()]

		course.modules = modules
		expect(course.modules).to.equal(modules)
	})
})
