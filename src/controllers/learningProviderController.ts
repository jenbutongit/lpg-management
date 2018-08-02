import {Request, Response} from 'express'

// import * as log4js from 'log4js'
import {LearningCatalogue} from '../learning-catalogue'

// const logger = log4js.getLogger('controllers/providerController')

export class LearningProviderController {
	learningCatalogue: LearningCatalogue
	// providerValidator: ProviderValidator
	// providerFactory: ProviderFactory

	constructor(
		learningCatalogue: LearningCatalogue
		// providerValidator: ProviderValidator,
		// providerFactory: ProviderFactory
	) {
		this.learningCatalogue = learningCatalogue
		// this.providerValidator = providerValidator
		// this.providerFactory = providerFactory
	}

	public getLearningProviders() {
		return async (request: Request, response: Response) => {
			response.render('page/learning-providers')
		}
	}

	public getLearningProvider() {
		return async (request: Request, response: Response) => {
			response.render('page/add-learning-provider')
		}
	}

	public setLearningProvider() {
		return async (request: Request, response: Response) => {
			const title = request.body.title

			// const errors = await this.providerValidator.check(request.body, [
			// 	'title',
			// ])
			// if (errors.size) {
			// 	return response.render('page/add-learning-provider', {
			// 		errors: errors,
			// 	})
			// }
			response.render('page/add-course-details', {title})
		}
	}
}
