import {IsNotEmpty, MaxLength, validate, ValidationError} from 'class-validator'
import {ValidationErrorMapper} from './validationErrorMapper'

/**
	Usage example:

    const courseContentValidator = new CourseContentValidator(new ValidationErrorMapper)

	const errors = courseContentValidator.check(request.params)

	if (errors.size > 0) {
		for (const message in errors.fields.shortDescription) {
			console.log(message)
		}
	}

 **/

export class CourseContentValidator {
	private _validationErrorMapper: ValidationErrorMapper

	constructor(validationErrorMapper: ValidationErrorMapper) {
		this._validationErrorMapper = validationErrorMapper
	}

	async check(params: any) {
		const errors: ValidationError[] = await validate(
			new CourseContent(params.shortDescription, params.description)
		)

		return this._validationErrorMapper.map(errors)
	}
}

class CourseContent {
	@IsNotEmpty()
	@MaxLength(160)
	shortDescription: string

	@IsNotEmpty()
	@MaxLength(1500)
	description: string

	constructor(shortDescription: string, description: string) {
		this.shortDescription = shortDescription
		this.description = description
	}
}
