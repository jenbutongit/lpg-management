import {beforeEach, describe, it} from 'mocha'
import {CourseValidator} from '../../../../src/learning-catalogue/validator/courseValidator'
import {expect} from 'chai'
import {ValidationErrorMapper} from '../../../../src/learning-catalogue/validator/validationErrorMapper'
import {CourseFactory} from '../../../../src/learning-catalogue/model/factory/courseFactory'

describe('CourseValidator tests', () => {
	let validator: CourseValidator

	beforeEach(() => {
		validator = new CourseValidator()
	})

	describe('Validating title only...', () => {
		it('should pass validation if title is set and is the only property', async () => {
			const errors = await validator.check(
				{
					title: 'Course Title',
				},
				'titleOnly'
			)

			expect(errors.size).to.equal(0)
		})

		it('should fail validation if title is present but is undefined', async () => {
			const errors = await validator.check(
				{
					title: undefined,
				},
				'titleOnly'
			)

			expect(errors.size).to.equal(1)
			expect(errors.fields._title).to.eql(['_title should not be empty'])
		})

		it('should fail validation if title is present but is an empty string', async () => {
			const errors = await validator.check(
				{
					title: '',
				},
				'titleOnly'
			)

			expect(errors.size).to.equal(1)
			expect(errors.fields._title).to.eql(['_title should not be empty'])
		})
	})

	describe('Validating descriptions only...', () => {
		it('should fail validation if shortDescription and description are missing', async () => {
			const params = {}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(4)
			expect(errors.fields._shortDescription).to.eql([
				'_shortDescription must be shorter than or equal to 160 characters',
				'_shortDescription should not be empty',
			])
			expect(errors.fields._description).to.eql([
				'_description must be shorter than or equal to 1500 characters',
				'_description should not be empty',
			])
		})

		it('should fail validation if shortDescription is greater than 160 characters', async () => {
			const params = {
				description: 'Course description',
				shortDescription: 'x'.repeat(161),
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(1)
			expect(errors.fields._shortDescription).to.eql([
				'_shortDescription must be shorter than or equal to 160 characters',
			])
		})

		it('should pass validation if shortDescription is 160 characters or less', async () => {
			const params = {
				description: 'Course description',
				shortDescription: 'x'.repeat(160),
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(0)
		})

		it('should fail validation if description is greater than 1500 characters', async () => {
			const params = {
				description: 'x'.repeat(1501),
				shortDescription: 'Course short description',
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(1)
			expect(errors.fields._description).to.eql([
				'_description must be shorter than or equal to 1500 characters',
			])
		})

		it('should pass validation if description is 1500 characters or less', async () => {
			const params = {
				description: 'x'.repeat(1500),
				shortDescription: 'Course short description',
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(0)
		})

		it('should fail validation if description is missing', async () => {
			const params = {
				shortDescription: 'Course short description',
				description: '',
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(1)
			expect(errors.fields._description).to.eql([
				'_description should not be empty',
			])
		})

		it('should pass validation if description and shortDescription are present', async () => {
			const params = {
				description: 'Course description',
				shortDescription: 'Course short description',
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(0)
		})
	})

	describe('Validating all course properties', () => {
		it('should fail validation if title is present but is undefined', async () => {
			const errors = await validator.check(
				{
					title: undefined,
					description: 'Course description',
					shortDescription: 'Course short description',
				},
				'titleOnly'
			)

			expect(errors.size).to.equal(1)
			expect(errors.fields._title).to.eql(['_title should not be empty'])
		})

		it('should fail validation if title is present but is an empty string', async () => {
			const errors = await validator.check(
				{
					title: '',
					description: 'Course description',
					shortDescription: 'Course short description',
				},
				'titleOnly'
			)

			expect(errors.size).to.equal(1)
			expect(errors.fields._title).to.eql(['_title should not be empty'])
		})

		it('should fail validation if title, shortDescription and description are missing', async () => {
			const params = {}

			const errors = await validator.check(params)

			expect(errors.size).to.equal(5)
			expect(errors.fields._shortDescription).to.eql([
				'_shortDescription must be shorter than or equal to 160 characters',
				'_shortDescription should not be empty',
			])
			expect(errors.fields._description).to.eql([
				'_description must be shorter than or equal to 1500 characters',
				'_description should not be empty',
			])
			expect(errors.fields._title).to.eql(['_title should not be empty'])
		})

		it('should fail validation if shortDescription is greater than 160 characters', async () => {
			const params = {
				title: 'Course Title',
				description: 'Course description',
				shortDescription: 'x'.repeat(161),
			}

			const errors = await validator.check(params)

			expect(errors.size).to.equal(1)
			expect(errors.fields._shortDescription).to.eql([
				'_shortDescription must be shorter than or equal to 160 characters',
			])
		})

		it('should pass validation if shortDescription is 160 characters or less', async () => {
			const params = {
				title: 'Course Title',
				description: 'Course description',
				shortDescription: 'x'.repeat(160),
			}

			const errors = await validator.check(params, 'descriptionsOnly')

			expect(errors.size).to.equal(0)
		})

		it('should fail validation if description is greater than 1500 characters', async () => {
			const params = {
				title: 'Course Title',
				description: 'x'.repeat(1501),
				shortDescription: 'Course short description',
			}

			const errors = await validator.check(params)

			expect(errors.size).to.equal(1)
			expect(errors.fields._description).to.eql([
				'_description must be shorter than or equal to 1500 characters',
			])
		})

		it('should pass validation if description is 1500 characters or less', async () => {
			const params = {
				title: 'Course Title',
				description: 'x'.repeat(1500),
				shortDescription: 'Course short description',
			}

			const errors = await validator.check(params)

			expect(errors.size).to.equal(0)
		})

		it('should fail validation if description is missing', async () => {
			const params = {
				title: 'Course Title',
				shortDescription: 'Course short description',
				description: '',
			}

			const errors = await validator.check(params)

			expect(errors.size).to.equal(1)
			expect(errors.fields._description).to.eql([
				'_description should not be empty',
			])
		})

		it('should pass validation if description and shortDescription are present', async () => {
			const params = {
				title: 'Course Title',
				description: 'Course description',
				shortDescription: 'Course short description',
			}

			const errors = await validator.check(params)

			expect(errors.size).to.equal(0)
		})
	})

	it('should be able to set error mapper', () => {
		const errorMapper: ValidationErrorMapper = <ValidationErrorMapper>{}
		validator.validationErrorMapper = errorMapper

		expect(validator.validationErrorMapper).to.equal(errorMapper)
	})

	it('should be able to set course factory', () => {
		const courseFactory: CourseFactory = <CourseFactory>{}
		validator.courseFactory = courseFactory

		expect(validator.courseFactory).to.equal(courseFactory)
	})
})
