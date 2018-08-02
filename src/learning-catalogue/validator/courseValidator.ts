import {validate, ValidationError} from 'class-validator'
import {ValidationErrorMapper} from './validationErrorMapper'
import {CourseFactory} from '../model/factory/courseFactory'

/**
 * Validates properties of a Course.
 *
 * const courseValidator = new CourseValidator()
 *
 * By default will validate all properties of a course:
 *
 * const errors = courseValidator.check(course)
 *
 * Individual properties can also be checked by adding them as an array after the course:
 *
 * const errors = courseValidator.check(course, ['title', 'shortDescription', 'description'])
 *
 * Currently only title, shortDescription, and description are validated.
 *
 * Errors are returned in an object:
 *
 * errors = {
 *   size: 2,
 *   fields: {
 *     title: [
 *       'validation.course.title.empty'
 *     ],
 *     shortDescription: [
 *       'validation.course.shortDescription.empty'
 *     ]
 *     description: [
 *       'validation.course.description.empty'
 *     ]
 *   }
 * }
 *
 * Example:
 *
 * const errors = courseValidator.check(course)
 *
 * if (errors.size()) {
 *   for (message in errors.fields.title) {
 *     console.log(message)
 *   }
 * }

 */

export class CourseValidator {
	private _validationErrorMapper: ValidationErrorMapper = new ValidationErrorMapper()
	private _courseFactory: CourseFactory = new CourseFactory()

	get validationErrorMapper(): ValidationErrorMapper {
		return this._validationErrorMapper
	}

	set validationErrorMapper(value: ValidationErrorMapper) {
		this._validationErrorMapper = value
	}

	get courseFactory(): CourseFactory {
		return this._courseFactory
	}

	set courseFactory(value: CourseFactory) {
		this._courseFactory = value
	}

	async check(
		params: any,
		groups: ['all' | 'title' | 'shortDescription' | 'description'] = ['all']
	) {
		const validationErrors: ValidationError[] = await validate(
			this._courseFactory.create(params),
			{groups: groups}
		)

		return this._validationErrorMapper.map(validationErrors)
	}
}
