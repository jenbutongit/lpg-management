import {IsNotEmpty} from 'class-validator'

export class TermsAndConditions {
	public id: string

	@IsNotEmpty({
		groups: ['all', 'name'],
		message: 'validation.termsAndConditions.name.empty',
	})
	public name: string

	@IsNotEmpty({
		groups: ['all', 'content'],
		message: 'validation.termsAndConditions.content.empty',
	})
	public content: string
}
