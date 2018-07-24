import {ValidationError} from 'class-validator'

export class ValidationErrorMapper {
	map(validationErrors: ValidationError[]) {
		const fields: any = {}

		validationErrors.map(
			x => (fields[x.property] = Object.values(x.constraints))
		)

		return {
			fields: fields,
			size: [].concat.apply([], Object.values(fields)).length,
		}
	}
}
