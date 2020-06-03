import {Answer} from './answer'

export class AnswerFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const answer = new Answer()
		let answersMap = new Map()

		answersMap.set('A', data.answers[0])

		answersMap.set('B', data.answers[1])

		answersMap.set('C', data.answers[2])

		answersMap.set('D', data.answers[3])

		answersMap.set('E', data.answers[4])

		answer.answers = answersMap

		answer.correctAnswers = data.correctAnswers

		//
		// answer.answers.set("A", data.answers[0])
		// answer.answers.set("B", data.answers[1])
		// answer.answers.set("C", data.answers[2])
		// answer.answers.set("D", data.answers[3])
		// answer.answers.set("E", data.answers[4])

		return answer
	}
}
