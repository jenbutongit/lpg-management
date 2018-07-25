import {IsNotEmpty, validate, ValidationError} from 'class-validator'
import {ValidationErrorMapper} from './validationErrorMapper'

/**
    Usage example:

    const courseTitleValidator = new CourseTitleValidator(new ValidationErrorMapper)

    const errors = courseTitleValidator.check(request.params)

    if (errors.size > 0) {
		for (const message in errors.fields.title) {
			console.log(message)
		}
	}

**/
export class CourseTitleValidator {
	private _validationErrorMapper: ValidationErrorMapper

	constructor(validationErrorMapper: ValidationErrorMapper) {
		this._validationErrorMapper = validationErrorMapper
	}

	async check(params: any) {
		const validationErrors: ValidationError[] = await validate(
			new CourseTitle(params.title)
		)

		return this._validationErrorMapper.map(validationErrors)
	}
}

class CourseTitle {
	@IsNotEmpty() title: string

	constructor(title: string) {
		this.title = title
	}
}
