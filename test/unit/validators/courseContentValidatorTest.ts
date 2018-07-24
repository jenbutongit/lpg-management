import {describe, it} from 'mocha'
import {CourseContentValidator} from '../../../src/validators/courseContentValidator'
import {expect} from 'chai'
import {ValidationErrorMapper} from '../../../src/validators/validationErrorMapper'

describe('CourseTitleValidator tests', () => {
	const validator = new CourseContentValidator(new ValidationErrorMapper())

	it('should fail validation if shortDescription and description are missing', async () => {
		const params = {}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(4)
		expect(errors.fields.shortDescription).to.eql([
			'shortDescription must be shorter than or equal to 160 characters',
			'shortDescription should not be empty',
		])
		expect(errors.fields.description).to.eql([
			'description must be shorter than or equal to 1500 characters',
			'description should not be empty',
		])
	})

	it('should fail validation if shortDescription is greater than 160 characters', async () => {
		const params = {
			description: 'Course description',
			shortDescription: 'x'.repeat(161),
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(1)
		expect(errors.fields.shortDescription).to.eql([
			'shortDescription must be shorter than or equal to 160 characters',
		])
	})

	it('should pass validation if shortDescription is 160 characters', async () => {
		const params = {
			description: 'Course description',
			shortDescription: 'x'.repeat(160),
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(0)
	})

	it('should fail validation if description is greater than 1500 characters', async () => {
		const params = {
			description: 'x'.repeat(1501),
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(1)
		expect(errors.fields.description).to.eql([
			'description must be shorter than or equal to 1500 characters',
		])
	})

	it('should pass validation if description is 1500 characters', async () => {
		const params = {
			description: 'x'.repeat(1500),
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(0)
	})

	it('should fail validation if description is missing', async () => {
		const params = {
			shortDescription: 'Course short description',
			description: '',
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(1)
		expect(errors.fields.description).to.eql([
			'description should not be empty',
		])
	})

	it('should pass validation if description and shortDescription are present', async () => {
		const params = {
			description: 'Course description',
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.size).to.equal(0)
	})
})
