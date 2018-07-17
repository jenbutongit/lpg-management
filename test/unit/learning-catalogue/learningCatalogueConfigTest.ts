import {LearningCatalogueConfig} from '../../../src/learning-catalogue/learningCatalogueConfig'
import {beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'

describe('LearningCatalogueConfig tests', () => {
	let config: LearningCatalogueConfig

	beforeEach(() => {
		config = new LearningCatalogueConfig('username', 'password', 'url')
	})

	it('should set properties in constructor', () => {
		expect(config.username).to.equal('username')
		expect(config.password).to.equal('password')
		expect(config.url).to.equal('url')
	})

	it('should be able to change username', () => {
		config.username = 'abc'
		expect(config.username).to.equal('abc')
	})

	it('should be able to change password', () => {
		config.password = 'abc'
		expect(config.password).to.equal('abc')
	})

	it('should be able to change url', () => {
		config.url = 'abc'
		expect(config.url).to.equal('abc')
	})
})
