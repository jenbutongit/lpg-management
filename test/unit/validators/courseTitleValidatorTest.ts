import {describe, it} from 'mocha'
import {CourseTitleValidator} from '../../../src/validators/courseTitleValidator'
import {expect} from 'chai'
import {ValidationErrorMapper} from '../../../src/validators/validationErrorMapper'

describe('CourseTitleValidator tests', () => {
	const validator = new CourseTitleValidator(new ValidationErrorMapper())

	it('should fail validation if title is missing', async () => {
		const params = {}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(1)
		expect(errors.fields.title).to.eql(['title should not be empty'])
	})

	it('should pass validation if title is present', async () => {
		const params = {
			title: 'Course title',
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(0)
	})
})
