import {Answer} from './answer'
import {MaxLength, MinLength} from 'class-validator'

export class Question {

	id: number


	@MaxLength(500 ,{
		groups: ['all', 'value'],
		message: 'skills.validation.question.max',
	})
	@MinLength(10 ,{
		groups: ['all', 'value'],
		message: 'skills.validation.question.min',
	})
	value: string

	answer: Answer

	@MaxLength(500 ,{
	groups: ['all', 'why'],
	message: 'skills.validation.why.max',
	})
	why: string

	@MaxLength(200 ,{
		groups: ['all', 'theme'],
		message: 'skills.validation.theme.max',
	})
	@MinLength(3 ,{
		groups: ['all', 'value'],
		message: 'skills.validation.theme.min',
	})
	theme: string

	@MaxLength(500 ,{
		groups: ['all', 'learningName'],
		message: 'skills.validation.learningName.max',
	})
	learningName: string


	@MaxLength(500 ,{
		groups: ['all', 'learningReference'],
		message: 'skills.validation.learningReference.max',
	})
	learningReference: string

	imgUrl: string

	alternativeText: string

	type: string
}
