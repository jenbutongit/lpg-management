import {IsNotEmpty, Length, validate, ValidationError} from 'class-validator'
import {ValidationErrorMapper} from './validationErrorMapper'

export class CourseContentValidator {
	private _validationErrorMapper: ValidationErrorMapper = new ValidationErrorMapper()

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
	@Length(0, 160)
	shortDescription: string

	@IsNotEmpty()
	@Length(0, 1500)
	description: string

	constructor(shortDescription: string, description: string) {
		this.shortDescription = shortDescription
		this.description = description
	}
}
