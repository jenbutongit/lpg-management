import {describe, it} from 'mocha'
import {CourseContentValidator} from '../../../src/validators/courseContentValidator'
import {expect} from 'chai'

describe('CourseTitleValidator tests', () => {
	const validator = new CourseContentValidator()

	it('should fail validation if shortDescription is missing', async () => {
		const params = {
			description: 'Course description',
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(1)
		expect(errors[0].constraints.isNotEmpty).to.equal(
			'shortDescription should not be empty'
		)
	})

	it('should fail validation if shortDescription is greater than 160 characters', async () => {
		const params = {
			description: 'Course description',
			shortDescription: 'x'.repeat(161),
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(1)
		expect(errors[0].constraints.length).to.equal(
			'shortDescription must be shorter than or equal to 160 characters'
		)
	})

	it('should pass validation if shortDescription is 160 characters', async () => {
		const params = {
			description: 'Course description',
			shortDescription: 'x'.repeat(160),
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(0)
	})

	it('should fail validation if description is greater than 1500 characters', async () => {
		const params = {
			description: 'x'.repeat(1501),
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(1)
		expect(errors[0].constraints.length).to.equal(
			'description must be shorter than or equal to 1500 characters'
		)
	})

	it('should fail validation if description is 1500 characters', async () => {
		const params = {
			description: 'x'.repeat(1500),
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(0)
	})

	it('should fail validation if description is missing', async () => {
		const params = {
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(1)
		expect(errors[0].constraints.isNotEmpty).to.equal(
			'description should not be empty'
		)
	})

	it('should pass validation if description and shortDescription are present', async () => {
		const params = {
			description: 'Course description',
			shortDescription: 'Course short description',
		}

		const errors = await validator.check(params)

		expect(errors.length).to.equal(0)
	})
})
