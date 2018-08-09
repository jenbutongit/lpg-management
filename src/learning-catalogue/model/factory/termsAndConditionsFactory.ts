import {TermsAndConditions} from '../termsAndConditions'

export class TermsAndConditionsFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const termsAndConditions: TermsAndConditions = new TermsAndConditions()

		termsAndConditions.id = data.id
		termsAndConditions.title = data.title
		termsAndConditions.termsAndConditions = data.termsAndConditions

		return termsAndConditions
	}
}
