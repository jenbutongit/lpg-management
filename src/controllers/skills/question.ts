import {Answer} from './answer'
import {IsNotEmpty} from "class-validator"

export class Question {

	id: number

	@IsNotEmpty({
		groups: ['all', 'value'],
		message: 'skills.validation.question.empty',
	})
	value: string

	answer: Answer

	@IsNotEmpty({
		groups: ['all', 'why'],
		message: 'skills.validation.why.empty',
	})
	why: string

	@IsNotEmpty({
		groups: ['all', 'theme'],
		message: 'skills.validation.theme.empty',
	})
	theme: string

	@IsNotEmpty({
		groups: ['all', 'suggestions'],
		message: 'skills.validation.suggestions.empty',
	})
	suggestions: string

	imgUrl: string

	alternativeText: string

	type: string
}
