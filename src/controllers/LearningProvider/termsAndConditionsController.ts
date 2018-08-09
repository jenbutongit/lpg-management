import {Request, Response} from 'express'
import {TermsAndConditionsValidator} from '../../learning-catalogue/validator/termsAndConditionsValidator'
import {TermsAndConditionsFactory} from '../../learning-catalogue/model/factory/termsAndConditionsFactory'
import {DefaultPageResults} from '../../learning-catalogue/model/defaultPageResults'
import {TermsAndConditions} from '../../learning-catalogue/model/termsAndConditions'
import {LearningProviderCatalogue} from '../../learning-catalogue/learning-provider'

export class TermsAndConditionsController {
	termsAndConditions: LearningProviderCatalogue
	termsAndConditionsValidator: TermsAndConditionsValidator
	termsAndConditionsFactory: TermsAndConditionsFactory

	constructor(
		termsAndConditions: LearningProviderCatalogue,
		termsAndConditionsValidator: TermsAndConditionsValidator,
		termsAndConditionsFactory: TermsAndConditionsFactory
	) {
		this.termsAndConditions = termsAndConditions
		this.termsAndConditionsValidator = termsAndConditionsValidator
		this.termsAndConditionsFactory = termsAndConditionsFactory
	}

	public index() {
		const self = this

		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			let page = 0
			let size = 10

			if (request.query.p) {
				page = request.query.p
			}
			if (request.query.s) {
				size = request.query.s
			}

			// prettier-ignore
			const pageResults: DefaultPageResults<TermsAndConditions> = await self.termsAndConditions.listTermsAndConditions(page, size)

			response.render('page/add-learning-providers', {pageResults})
		}
	}

	public getTermsAndConditions() {
		return async (request: Request, response: Response) => {
			response.render('page/add-terms-and-conditions')
		}
	}

	public setTermsAndConditions() {
		// const self = this

		return async (request: Request, response: Response) => {
			// const data = {
			// 	...request.body,
			// }

			// const termsAndConditions = this.termsAndConditionsFactory.create(
			// 	data
			// )

			const errors = await this.termsAndConditionsValidator.check(
				request.body,
				['title', 'termsAndConditions']
			)
			if (errors.size) {
				return response.render('page/add-terms-and-conditions', {
					errors: errors,
				})
			}

			// await self.termsAndConditions.createTermsAndConditions(
			// 	termsAndConditions
			// )

			response.redirect('/content-management/add-learning-provider')
		}
	}
}
