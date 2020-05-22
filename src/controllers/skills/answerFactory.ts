import {Answer} from './answer'

export class AnswerFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const answer = new Answer()

		answer.correctAnswer = data.correctAnswer
		answer.answers = data.answers

		return answer
	}
}
