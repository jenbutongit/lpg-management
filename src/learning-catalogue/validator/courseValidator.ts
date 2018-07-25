import {validate, ValidationError} from 'class-validator'
import {ValidationErrorMapper} from './validationErrorMapper'
import {CourseFactory} from '../model/factory/courseFactory'

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
		group: 'default' | 'titleOnly' | 'descriptionsOnly' = 'default'
	) {
		const validationErrors: ValidationError[] = await validate(
			this._courseFactory.create(params),
			{groups: [group]}
		)

		return this._validationErrorMapper.map(validationErrors)
	}
}
