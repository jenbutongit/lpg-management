import {Learner} from '../Learner'

export class LearnerFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any) {
		let learner: Learner = new Learner()

		learner.id = data.id
		learner.uid = data.uid
		learner.learnerEmail = data.learnerEmail

		return learner
	}
}
