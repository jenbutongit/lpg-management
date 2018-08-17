import {LearningProvider} from '../learningProvider'
import {Factory} from './factory'

export class LearningProviderFactory extends Factory<LearningProvider> {
	create(data: any) {
		const learningProvider: LearningProvider = new LearningProvider()

		learningProvider.id = data.id
		learningProvider.name = data.name
		learningProvider.cancellationPolicies = data.cancellationPolicies
		learningProvider.termsAndConditions = data.termsAndConditions

		return learningProvider
	}
}
