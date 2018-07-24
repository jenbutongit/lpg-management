import {describe, it} from 'mocha'
import {CourseTitleValidator} from '../../../src/validators/courseTitleValidator'
import {expect} from 'chai'

describe('CourseTitleValidator tests', () => {
	const validator = new CourseTitleValidator()

	it('should fail validation if title is missing', async () => {
		const params = {}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(1)
		expect(errors[0].constraints.isNotEmpty).to.equal(
			'title should not be empty'
		)
	})

	it('should pass validation if title is present', async () => {
		const params = {
			title: 'Course title',
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(0)
	})
})
