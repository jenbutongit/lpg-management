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
		groups: ['all', 'learningName'],
		message: 'skills.validation.learningName.empty',
	})
	learningName: string

	@IsNotEmpty({
		groups: ['all', 'learningReference'],
		message: 'skills.validation.learningReference.empty',
	})
	learningReference: string

	imgUrl: string

	alternativeText: string

	type: string
}
