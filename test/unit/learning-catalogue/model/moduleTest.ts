import {Event} from '../../../../src/learning-catalogue/model/event'
import {beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'
import {Module} from '../../../../src/learning-catalogue/model/module'
import {Audience} from '../../../../src/learning-catalogue/model/audience'

describe('Course tests', () => {
	let module: Module

	beforeEach(() => {
		module = new Module()
	})

	it('should be able to set id', () => {
		module.id = 'test-id'
		expect(module.id).to.equal('test-id')
	})

	it('should be able to set type', () => {
		module.type = 'test-type'
		expect(module.type).to.equal('test-type')
	})

	it('should be able to set title', () => {
		module.title = 'test-title'
		expect(module.title).to.equal('test-title')
	})

	it('should be able to set description', () => {
		module.description = 'test-description'
		expect(module.description).to.equal('test-description')
	})

	it('should be able to set duration', () => {
		module.duration = 999
		expect(module.duration).to.equal(999)
	})

	it('should be able to set url', () => {
		module.url = 'test-url'
		expect(module.url).to.equal('test-url')
	})

	it('should be able to set fileSize', () => {
		module.fileSize = 999
		expect(module.fileSize).to.equal(999)
	})

	it('should be able to set parsedFileSize', () => {
		module.parsedFileSize = 'test-parsedFileSize'
		expect(module.parsedFileSize).to.equal('test-parsedFileSize')
	})

	it('should be able to set location', () => {
		module.location = 'test-location'
		expect(module.location).to.equal('test-location')
	})

	it('should be able to set price', () => {
		module.price = 1000
		expect(module.price).to.equal(1000)
	})

	it('should be able to set productCode', () => {
		module.productCode = 'test-productCode'
		expect(module.productCode).to.equal('test-productCode')
	})

	it('should be able to set startPage', () => {
		module.startPage = 'test-startPage'
		expect(module.startPage).to.equal('test-startPage')
	})

	it('should be able to set audience', () => {
		const audiences: Audience[] = [new Audience()]
		module.audiences = audiences
		expect(module.audiences).to.equal(audiences)
	})

	it('should be able to set events', () => {
		const events: Event[] = [new Event()]
		module.events = events
		expect(module.events).to.equal(events)
	})
})
