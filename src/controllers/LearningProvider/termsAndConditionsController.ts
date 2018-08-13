import {Request, Response} from 'express'
import * as log4js from 'log4js'
import {LearningCatalogue} from '../../learning-catalogue'
import {TermsAndConditionsValidator} from '../../learning-catalogue/validator/termsAndConditionsValidator'
import {TermsAndConditionsFactory} from '../../learning-catalogue/model/factory/termsAndConditionsFactory'

const logger = log4js.getLogger('controllers/learningProviderController')

export class TermsAndConditionsController {
	learningCatalogue: LearningCatalogue
	termsAndConditionsValidator: TermsAndConditionsValidator
	termsAndConditionsFactory: TermsAndConditionsFactory

	constructor(
		learningCatalogue: LearningCatalogue,
		termsAndConditionsValidator: TermsAndConditionsValidator,
		termsAndConditionsFactory: TermsAndConditionsFactory
	) {
		this.learningCatalogue = learningCatalogue
		this.termsAndConditionsValidator = termsAndConditionsValidator
		this.termsAndConditionsFactory = termsAndConditionsFactory
	}

	public getTermsAndConditions() {
		logger.debug('Getting terms and conditions')
		return async (request: Request, response: Response) => {
			await this.getLearningProviderAndRenderTemplate(request, response, 'page/add-terms-and-conditions')
		}
	}

	public setTermsAndConditions() {
		const self = this

		return async (request: Request, response: Response) => {
			const data = {
				...request.body,
			}

			const termsAndConditions = this.termsAndConditionsFactory.create(data)

			const errors = await this.termsAndConditionsValidator.check(request.body, ['title'])
			if (errors.size) {
				return response.render('page/add-terms-and-conditions', {
					errors: errors,
				})
			}
			const learningProviderId: string = request.params.learningProviderId

			await self.learningCatalogue.createTermsAndConditions(learningProviderId, termsAndConditions)

			response.redirect('/content-management/learning-providers/' + learningProviderId)
		}
	}

	private async getLearningProviderAndRenderTemplate(request: Request, response: Response, view: string) {
		const learningProviderId: string = request.params.learningProviderId
		const learningProvider = await this.learningCatalogue.getLearningProvider(learningProviderId)
		if (learningProvider) {
			response.render(view, {learningProvider})
		} else {
			response.sendStatus(404)
		}
	}
}
