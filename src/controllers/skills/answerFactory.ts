import {Answer} from './answer'

export class AnswerFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const answer = new Answer()
		const answers = {}

		let charCount = 65
		for (let i = 0; i < 5; i++) {
			console.log(charCount + " : "+ String.fromCharCode(charCount))
			//@ts-ignore
			answers[String.fromCharCode(charCount)] = data.answers[i]
			charCount++
		}
		answer.id = data.id
		answer.answers = answers
		answer.correctAnswers = data.correctAnswers
		return answer
	}
}
