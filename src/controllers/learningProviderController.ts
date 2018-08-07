import {Request, Response} from 'express'
import {LearningProviderValidator} from '../learning-catalogue/validator/learningProviderValidator'
import {LearningProviderFactory} from '../learning-catalogue/model/factory/learningProviderFactory'
// import * as log4js from 'log4js'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'
import {LearningProvider} from '../learning-catalogue/model/learningProvider'
import {LearningProviderCatalogue} from '../learning-catalogue/learning-provider'

// const logger = log4js.getLogger('controllers/providerController')

export class LearningProviderController {
	learningProvider: LearningProviderCatalogue
	learningProviderValidator: LearningProviderValidator
	learningProviderFactory: LearningProviderFactory

	constructor(
		learningProvider: LearningProviderCatalogue,
		learningProviderValidator: LearningProviderValidator,
		learningProviderFactory: LearningProviderFactory
	) {
		this.learningProvider = learningProvider
		this.learningProviderValidator = learningProviderValidator
		this.learningProviderFactory = learningProviderFactory
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
			const pageResults: DefaultPageResults<LearningProvider> = await self.learningProvider.listAll(page, size)

			response.render('page/learning-providers', {pageResults})
		}
	}

	public getLearningProviders() {
		// const self = this

		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			// let page = 0
			// let size = 10

			// if (request.query.p) {
			// 	page = request.query.p
			// }
			// if (request.query.s) {
			// 	size = request.query.s
			// }

			// // prettier-ignore
			// const pageResults: DefaultPageResults<LearningProvider> = await self.learningProvider.listAll(page, size)

			response.render('page/learning-providers', {})
		}
	}

	public getLearningProvider() {
		return async (request: Request, response: Response) => {
			response.render('page/add-learning-provider')
		}
	}

	public setLearningProvider() {
		const self = this

		return async (request: Request, response: Response) => {
			const data = {
				...request.body,
			}

			const learningProvider = this.learningProviderFactory.create(data)

			const errors = await this.learningProviderValidator.check(
				request.body,
				['name']
			)
			if (errors.size) {
				return response.render('page/add-learning-provider', {
					errors: errors,
				})
			}

			await self.learningProvider.create(learningProvider)

			response.redirect('/content-management/learning-providers')
		}
	}
}
