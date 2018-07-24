import {IsNotEmpty, Length, validate} from 'class-validator'

export class CourseContentValidator {
	check(params: any) {
		return validate(
			new CourseContent(params.shortDescription, params.description)
		)
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
