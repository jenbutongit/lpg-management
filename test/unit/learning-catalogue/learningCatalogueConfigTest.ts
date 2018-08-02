import {LearningCatalogueConfig} from '../../../src/learning-catalogue/learningCatalogueConfig'
import {beforeEach, describe, it} from 'mocha'
import {expect} from 'chai'

describe('LearningCatalogueConfig tests', () => {
	let config: LearningCatalogueConfig

	beforeEach(() => {
		config = new LearningCatalogueConfig(
			{username: 'username', password: 'password'},
			'url'
		)
	})

	it('should set properties in constructor', () => {
		expect(config.auth.username).to.equal('username')
		expect(config.auth.password).to.equal('password')
		expect(config.url).to.equal('url')
	})

	it('should be able to change username', () => {
		config.auth.username = 'abc'
		expect(config.auth.username).to.equal('abc')
	})

	it('should be able to change password', () => {
		config.auth.password = 'abc'
		expect(config.auth.password).to.equal('abc')
	})

	it('should be able to change url', () => {
		config.url = 'abc'
		expect(config.url).to.equal('abc')
	})
})
