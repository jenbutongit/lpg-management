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
		// question.answer.answers = data.answers
		// question.answer.correctAnswer = data.checkBox
		let answer = {
			'correctAnswer': data.checkBox,
			'answers': data.answers,
		}
		question.answer = this._answerFactory.create(answer)
		question.why = data.why
		question.theme = data.theme
		question.suggestions = data.suggestions
		question.imgUrl = data.imgUrl
		return question
	}
}
