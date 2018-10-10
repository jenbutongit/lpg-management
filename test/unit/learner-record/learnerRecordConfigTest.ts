import * as chai from 'chai'
import {expect} from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import {beforeEach} from 'mocha'
import {LearnerRecordConfig} from '../../../src/leaner-record/learnerRecordConfig'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Tests for leanerRecordConfig', () => {
	let config: LearnerRecordConfig

	beforeEach(() => {})

	it('Should be able to pass url and timeout into constructor', () => {
		config = new LearnerRecordConfig('http://example.com', 10000)
		expect(config.url).to.equal('http://example.com')
		expect(config.timeout).to.equal(10000)
	})

	it('Should set timeout to 15000ms by default', () => {
		config = new LearnerRecordConfig('http://example.com')
		expect(config.url).to.equal('http://example.com')
		expect(config.timeout).to.equal(15000)
	})
})
