import {Quiz} from './quiz'

export class QuizFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	create(data: any) {
		const quiz = new Quiz()

		quiz.id = data.id
		quiz.questions = data.questions
		quiz.status = data.status
		quiz.description = data.description
		quiz.numberOfAttempts = data.numberOfAttempts
		quiz.averageScore = data.averageScore
		return quiz
	}
}
