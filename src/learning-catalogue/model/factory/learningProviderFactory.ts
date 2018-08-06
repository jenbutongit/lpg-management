import {LearningProvider} from '../learningProvider'

export class LearningProviderFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const learningProvider: LearningProvider = new LearningProvider()

		learningProvider.id = data.id
		learningProvider.name = data.name
		learningProvider.dateAdded = data.today

		return learningProvider
	}
}
