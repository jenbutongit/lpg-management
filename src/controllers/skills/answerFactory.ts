import {Answer} from './answer'

export class AnswerFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const answer = new Answer()
		let answers: any = {}

		let charCount = 65
		for (let i = 0; i < 5; i++) {
			console.log(charCount + " : "+ String.fromCharCode(charCount))
			if (data.answers[0]) {
				// @ts-ignore
				answers[String.fromCharCode(charCount)] = data.answers[i]
			} else {
				// @ts-ignore
				answers[String.fromCharCode(charCount)] = this.getKeyCode(i,data)
			}
			charCount++
		}
		if(data.id && data.id != "") {
			answer.id = data.id
		}
		answer.answers = answers
		if(Array.isArray(data.correctAnswers)) {
			answer.correctAnswers = data.correctAnswers
		} else {
			let array = []
			array.push(data.correctAnswers)
			answer.correctAnswers = array
			console.log("wroks")
		}

		return answer
	}

	getKeyCode(id: any, data: any) {
		let value: any = ""
		switch(id) {
			case 1:
				value = data.answers.A
				break;
			case 2:
				value = data.answers.B
				break;
			case 3:
				value = data.answers.C
				break;
			case 4:
				value = data.answers.D
				break;
			default:
				value = ""
		}

		return value
	}
}
