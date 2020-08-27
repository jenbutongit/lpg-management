import {Answer} from '../../../controllers/skills/answer'


export function IsAnswersValid(answerObj: Answer) {
	let counterForEmptyAnswers = 0
	let answersError = {answers: ["skills.validation.answers.empty"]}
	let correctAnswersError = {correctAnswers: ["skills.validation.correctAnswers.empty"]}
	let answerErrors = []

	if(answerObj.answers.length > 0 ) {
		answerObj.answers.forEach(function(answer: any) {
			if(answer == "") {
				counterForEmptyAnswers++
			}
		});
	}

	if(answerObj.correctAnswers == null || answerObj.correctAnswers.length == 0) {
		answerErrors.push(correctAnswersError)
	}

	if(counterForEmptyAnswers > 3 ) {
		answerErrors.push(answersError)
	}

	return answerErrors
}
