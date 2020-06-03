import {Question} from './question'
import {AnswerFactory} from "./answerFactory"

export class QuestionFactory {

	private _answerFactory: AnswerFactory
	constructor(answerFactroy = new AnswerFactory()) {
		this._answerFactory = answerFactroy
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const question = new Question()

		question.value = data.value
		let answer = null
		// question.answer.answers = data.answers
		// question.answer.correctAnswer = data.checkBox
		if(data.answer) {
			answer = {
				'correctAnswers': data.answer.correctAnswers,
				'answers': data.answer.answers,
			}
		} else {
			answer = {
				'correctAnswers': data.correctAnswers,
				'answers': data.answers,
			}
		}

		question.answer = this._answerFactory.create(answer)
		question.why = data.why
		question.theme = data.theme
		question.suggestions = data.suggestions
		question.img = data.imgUrl
		return question
	}
}
