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

		if (data.questionId && data.questionId != "") {
			question.id = data.questionId
		} else if (data.id && data.id != "") {
			question.id = data.id
		}


		question.value = data.value
		let answer = null
		if(data.answer) {
			answer = {
				'id': data.answerId,
				'correctAnswers': data.answer.correctAnswers,
				'answers': data.answer.answers,
			}
		} else if (data.correctAnswers) {
			answer = {
				'id': data.answerId,
				'correctAnswers': data.correctAnswers,
				'answers': data.answers,
			}
		}

		if(data.type) {
			question.type = data.type
		}

		question.answer = this._answerFactory.create(answer)
		question.why = data.why
		question.theme = data.theme
		question.learningName = data.learningName
		question.learningReference = data.learningReference
		if (data.mediaId) {
			question.imgUrl = "https://lpgdev.blob.core.windows.net/lpgdevcontent/quiz-images/" + data.mediaId.split("/").pop() + "/" + data.imageName
		} else if (data.imgUrl) {
			question.imgUrl = data.imgUrl
		}
		question.alternativeText = data.alternativeText
		return question
	}
}
