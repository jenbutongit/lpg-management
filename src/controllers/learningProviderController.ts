import {Request, Response} from 'express'
import {LearningProviderValidator} from '../learning-catalogue/validator/learningProviderValidator'
import {LearningProviderFactory} from '../learning-catalogue/model/factory/learningProviderFactory'
// import * as log4js from 'log4js'
import {LearningCatalogue} from '../learning-catalogue'

// const logger = log4js.getLogger('controllers/providerController')

export class LearningProviderController {
	learningCatalogue: LearningCatalogue
	learningProviderValidator: LearningProviderValidator
	learningProviderFactory: LearningProviderFactory

	constructor(
		learningCatalogue: LearningCatalogue,
		learningProviderValidator: LearningProviderValidator,
		learningProviderFactory: LearningProviderFactory
	) {
		this.learningCatalogue = learningCatalogue
		this.learningProviderValidator = learningProviderValidator
		this.learningProviderFactory = learningProviderFactory
	}

	// public index() {
	// 	const self = this

	// 	//TODO: Return empty list of results here if learning catalogue is down?
	// 	return async (request: Request, response: Response) => {
	// 		let page = 0
	// 		let size = 10

	// 		if (request.query.p) {
	// 			page = request.query.p
	// 		}
	// 		if (request.query.s) {
	// 			size = request.query.s
	// 		}

	// 		// prettier-ignore
	// 		// const pageResults: DefaultPageResults<LearningProvider> = await self.learningCatalogue.listAll(page, size)

	// 		response.render('page/leaning-providers', {

	// 		})
	// 	}
	// }

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
			const name = request.body.name

			const errors = await this.learningProviderValidator.check(
				request.body,
				['name']
			)
			if (errors.size) {
				return response.render('page/add-learning-provider', {
					errors: errors,
				})
			}
			response.render('page/learning-providers', {name})
		}
	}
}
