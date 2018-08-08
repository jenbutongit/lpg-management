import {Request, Response} from 'express'
import {CancellationPolicyValidator} from '../../learning-catalogue/validator/cancellationPolicyValidator'
import {CancellationPolicyFactory} from '../../learning-catalogue/model/factory/cancellationPolicyFactory'
import {DefaultPageResults} from '../../learning-catalogue/model/defaultPageResults'
import {CancellationPolicy} from '../../learning-catalogue/model/cancellationPolicy'
import {LearningProviderCatalogue} from '../../learning-catalogue/learning-provider'

export class CancellationPolicyController {
	cancellationPolicy: LearningProviderCatalogue
	cancellationPolicyValidator: CancellationPolicyValidator
	cancellationPolicyFactory: CancellationPolicyFactory

	constructor(
		cancellationPolicy: LearningProviderCatalogue,
		cancellationPolicyValidator: CancellationPolicyValidator,
		cancellationPolicyFactory: CancellationPolicyFactory
	) {
		this.cancellationPolicy = cancellationPolicy
		this.cancellationPolicyValidator = cancellationPolicyValidator
		this.cancellationPolicyFactory = cancellationPolicyFactory
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
			const pageResults: DefaultPageResults<CancellationPolicy> = await self.cancellationPolicy.listCancellationPolicy(page, size)

			response.render('page/add-learning-providers', {pageResults})
		}
	}

	public getCancellationPolicy() {
		return async (request: Request, response: Response) => {
			response.render('page/add-cancellation-policy')
		}
	}

	public setCancellationPolicy() {
		const self = this

		return async (request: Request, response: Response) => {
			const data = {
				...request.body,
			}

			const cancellationPolicy2 = this.cancellationPolicyFactory.create(
				data
			)

			const errors = await this.cancellationPolicyValidator.check(
				request.body,
				['name', 'shortVersion', 'fullVersion']
			)
			if (errors.size) {
				return response.render('page/add-cancellation-policy', {
					errors: errors,
				})
			}

			await self.cancellationPolicy.createCancellationPolicy(
				cancellationPolicy2
			)

			response.redirect('/content-management/add-learning-provider')
		}
	}
}
