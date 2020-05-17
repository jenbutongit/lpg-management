import {Question} from './question'

export class QuestionFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const question = new Question()

		question.value = data.value
		question.answer = data.answer
		question.why = data.why
		question.theme = data.theme
		question.suggestions = data.suggestions
		question.imgUrl = data.imgUrl
		return question
	}
}
