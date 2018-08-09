import {IsNotEmpty} from 'class-validator'

export class TermsAndConditions {
	public id: string

	@IsNotEmpty({
		groups: ['all', 'title'],
		message: 'validation.termsAndConditions.title.empty',
	})
	public title: string

	@IsNotEmpty({
		groups: ['all', 'termsAndConditions'],
		message: 'validation.termsAndConditions.termsAndConditions.empty',
	})
	public termsAndConditions: string

	public dateAdded: string
}
