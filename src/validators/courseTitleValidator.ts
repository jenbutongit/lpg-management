import {IsNotEmpty, validate} from 'class-validator'

export class CourseTitleValidator {
	check(params: any) {
		return validate(new CourseTitle(params.title))
	}
}

class CourseTitle {
	@IsNotEmpty() title: string

	constructor(title: string) {
		this.title = title
	}
}
