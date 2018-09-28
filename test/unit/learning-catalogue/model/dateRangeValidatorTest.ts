import {DateRange} from '../../../../src/learning-catalogue/model/dateRange'
import {Validator} from '../../../../src/learning-catalogue/validator/validator'
import {DateRangeFactory} from '../../../../src/learning-catalogue/model/factory/dateRangeFactory'
import {Factory} from '../../../../src/learning-catalogue/model/factory/factory'
import moment = require('moment')
import {expect} from 'chai'

describe('DateRange validation tests', () => {
	let dateRangeFactory: Factory<DateRange>
	let validator: Validator<DateRange>

	before(() => {
		dateRangeFactory = new DateRangeFactory()
		validator = new Validator<DateRange>(dateRangeFactory)
	})

	it('should pass validation if valid', async () => {
		const date = moment().add(1, 'days')

		const data: any = {
			day: `${date.date()}`,
			month: `${date.month() + 1}`,
			year: `${date.year()}`,
			'start-time': [
				'9','0'
			],
			'end-time': [
				'17','00'
			]
		}

		const result = await validator.check(data, ['event.dateRanges.date'])

		return expect(result.size).to.be.equal(0)
	})

	it('should fail validation if date is in the past', async () => {
		const date = moment().subtract(1, 'days')

		const data: any = {
			day: `${date.date()}`,
			month: `${date.month() + 1}`,
			year: `${date.year()}`,
			'start-time': [
				'9','0'
			],
			'end-time': [
				'17','00'
			]
		}

		const result = await validator.check(data, ['event.dateRanges.date'])

		expect(result.size).to.be.equal(1)
		expect(result.fields).to.be.eql({  "date": [
			"validation_module_event_dateRanges_past"
		]})
	})

	it('should fail validation if startTime is missing', async () => {
		const date = moment().add(1, 'days')

		const data: any = {
			day: `${date.date()}`,
			month: `${date.month() + 1}`,
			year: `${date.year()}`,
			'end-time': [
				'17','00'
			]
		}

		const result = await validator.check(data, ['event.dateRanges.startTime'])

		expect(result.size).to.be.equal(1)
		expect(result.fields).to.be.eql({  "startTime": [
				"validation_module_event_start_empty"
			]})
	})

	it('should fail validation if endTime is missing', async () => {
		const date = moment().add(1, 'days')

		const data: any = {
			day: `${date.date()}`,
			month: `${date.month() + 1}`,
			year: `${date.year()}`,
			'start-time': [
				'09','00'
			]
		}

		const result = await validator.check(data, ['event.dateRanges.endTime'])

		expect(result.size).to.be.equal(1)
		expect(result.fields).to.be.eql({  "endTime": [
			"validation_module_event_end_empty"
		]})
	})

	it('should fail validation if endTime is before startTime', async () => {
		const date = moment().add(1, 'days')

		const data: any = {
			day: `${date.date()}`,
			month: `${date.month() + 1}`,
			year: `${date.year()}`,
			'start-time': [
				'09','00'
			],
			'end-time': [
				'08','00'
			]
		}

		const result = await validator.check(data, ['event.dateRanges.endTime'])

		expect(result.size).to.be.equal(1)
		expect(result.fields).to.be.eql({  "endTime": [
				"validation_module_event_dateRanges_endBeforeStart"
			]})
	})
})