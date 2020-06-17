import {NextFunction, Request, Response, Router} from 'express'
import {CsrsService} from '../../csrs/service/csrsService'
// import * as csvtojson from 'csvtojson'
import {PlaceholderDateSkills} from '../../learning-catalogue/model/placeholderDateSkills'
// import {Validate} from '../formValidator'
import {FormController} from '../formController'
import {Validator} from '../../learning-catalogue/validator/validator'
 import {QuestionFactory} from './questionFactory'
import {QuizFactory} from './quizFactory'
import {Question} from "./question"
import {Profession} from "./profession"
import {Answer} from "./answer"
import * as config from "../../config"
// import {Answer} from "./answer"

export class SkillsController implements FormController {
	csrsService: CsrsService
	validator: Validator<Question>
	router: Router
	questionFactory: QuestionFactory
	quizFactory: QuizFactory

	constructor(csrsService: CsrsService, questionFactory: QuestionFactory, quizFactory: QuizFactory, questionValidator: Validator<Question>) {
		this.router = Router()
		this.csrsService = csrsService
		this.validator = questionValidator
		this.questionFactory = questionFactory
		this.quizFactory = quizFactory
		this.configureRouterPaths()
	}

	private configureRouterPaths() {
		this.router.get('/content-management/skills', this.getSkills())
		this.router.get('/content-management/skills/add-new-question/success', this.getSkills())
		this.router.get('/content-management/skills/update-question/success', this.getSkills())
		this.router.get('/content-management/skills/generate-report', this.getSkillsReport())
		this.router.get('/content-management/skills/add-new-question', this.getAddQuestion())
		this.router.post('/content-management/skills/add-new-question', this.AddQuestion())
		this.router.get('/content-management/skills/delete-quiz', this.getDeleteQuiz())
		this.router.post('/content-management/skills/delete-quiz', this.deleteQuiz())
		this.router.get('/content-management/skills/add-image', this.getImage())
		this.router.get('/content-management/skills/edit-quiz-description', this.getEditQuitDescription())
		this.router.post('/content-management/skills/edit-quiz-description', this.editQuizDescription())
		this.router.get('/content-management/skills/:questionID/edit-question', this.getEditQuestion())
		this.router.post('/content-management/skills/:questionID/edit-question', this.EditQuestion())
		this.router.get('/content-management/skills/:questionID/delete-question', this.getDeleteQuestion())
		this.router.post('/content-management/skills/:questionID/delete-question', this.deleteQuestion())
		this.router.post('/content-management/skills/publish-quiz', this.publishSkills())
		this.router.get('/content-management/skills/publish-quiz/success', this.getSkills())
		this.router.get('/content-management/skills/publish-quiz/failure', this.getSkills())
	}

	publishSkills() {
		return async (req: Request, res: Response, next: NextFunction) => {

			let profession = new Profession()

			await this.csrsService
				.getCivilServant()
				.then(civilServant => {
					if (civilServant.profession) {
						profession.id = civilServant.profession.id
					}
				})
				.catch(error => {
					next(error)
				})

			await this.csrsService
				.publishSkills(profession)
				.then(() => {
					req.session!.save(() => {
						res.redirect(`/content-management/skills/publish-quiz/success`)
					})
				})
				.catch(error => {
					res.redirect(`/content-management/skills/publish-quiz/failure`)
				})
		}
	}

	editQuizDescription() {
		return async (req: Request, res: Response, next: NextFunction) => {
			let professionID: any = null
			let description: any = req.body.description
			if (description != '') {
				await this.csrsService
					.getCivilServant()
					.then(civilServant => {
						if (civilServant.profession) {
							professionID = civilServant.profession.id
						}
					})
					.catch(error => {
						next(error)
					})

				let profession = new Profession();
				profession.id = professionID

				await this.csrsService
					.editDescription(profession, description)
					.then(() => {
						req.session!.save(() => {
							res.redirect(`/content-management/skills`)
						})
					})
					.catch(error => {
						next(error)
					})
			} else {
				req.session!.save(() => {
					res.render('page/skills/edit-quiz-description', {
						error: 'Description is required',
					})
				})
			}
		}
	}


	AddQuestion() {
		return async (req: Request, res: Response, next: NextFunction) => {

			console.log("This is being called")

			let answer = new Answer()
			answer.answers = req.body.answers
			answer.correctAnswers = req.body.correctAnswers

			let data = {
				"value" : req.body.value,
				'answer': answer,
				"why" : req.body.why,
				'theme': req.body.theme,
				'suggestions': req.body.suggestions,
				'img': req.body.imgUrl,
			}
			let errors = await this.validator.check(data)

			if (errors.size) {
				req.session!.sessionFlash = {
					errors,
					form: req.body,
				}
				return req.session!.save(() => {
					res.redirect('/content-management/skills/add-new-question')
				})
			} else {
				const question = this.questionFactory.create(req.body)

				await this.csrsService
					.postQuestion(question)
					.then(() => {
						res.redirect('/content-management/skills/add-new-question/success')
					})
					.catch(error => {
						next(error)
					})
			}

		}
	}

	deleteQuiz() {
		return async (req: Request, res: Response, next: NextFunction) => {
			let professionID: any = null

			if (req.body.deleteQuiz == 'True') {
				await this.csrsService
					.getCivilServant()
					.then(civilServant => {
						if (civilServant.profession) {
							professionID = civilServant.profession.id
						}
					})
					.catch(error => {
						next(error)
					})

				await this.csrsService
					.deleteQuizByProfession(professionID)
					.then(() => {
						req.session!.save(() => {
							res.redirect(`/content-management`)
						})
					})
					.catch(error => {
						next(error)
					})
			} else if (req.body.deleteQuiz == 'False')  {
				req.session!.save(() => {
					res.redirect(`/content-management/skills`)
				})
			} else {
				req.session!.save(() => {
					res.render('page/skills/delete-quiz', {
						error: 'please select a yes or no',
					})
				})
			}
		}
	}

	deleteQuestion() {

		return async (req: Request, res: Response, next: NextFunction) => {

			if (req.body.deleteQuestion == 'True') {
				await this.csrsService
					.deleteQuestionbyID(req.params.questionID)
					.then(() => {
						req.session!.save(() => {
							res.redirect(`/content-management/skills`)
						})
					})
					.catch(error => {
						next(error)
					})
			} else if (req.body.deleteQuestion == 'False')  {
				req.session!.save(() => {
					res.redirect(`/content-management/skills/${req.params.questionID}/edit-question`)
				})
			} else {
				req.session!.save(() => {
					res.render('page/skills/delete-question', {
						error: 'please select a yes or no',
					})
				})
			}
		}


	}

	getDeleteQuestion() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const questionID = req.params.questionID
			req.session!.save(() => {
				res.render('page/skills/delete-question', {
					questionID: questionID
				})
			})
		}
	}

	getDeleteQuiz() {
		return async (req: Request, res: Response, next: NextFunction) => {
			req.session!.save(() => {
				res.render('page/skills/delete-quiz')
			})
		}
	}

	getSkills() {
		return async (req: Request, res: Response, next: NextFunction) => {
			let professionID: any = null
			let professionName: any = null
			let quiz: any = null
			let url: any = req.url
			let message: string = ""
			let errorMessage: string = ""
			// const userRoles = req.user.roles

			if(url == '/content-management/skills/add-new-question/success') {
				message = 'Question successfuly added'
			} else if (url == '/content-management/skills/update-question/success') {
				message = 'Question updated successfuly'
			} else if (url == '/content-management/skills/publish-quiz/success') {
				message = 'Quiz published successfuly'
			} else if (url == '/content-management/skills/publish-quiz/failure') {
				errorMessage = 'A quiz must have a minimum of 18 questions'
			}

			await this.csrsService
				.getCivilServant()
				.then(civilServant => {
					if (civilServant.profession) {
						professionID = civilServant.profession.id
						professionName = civilServant.profession.name
						res.locals.professionID = professionID
					}
				})
				.catch(error => {
					next(error)
				})

			if (professionID != null) {
				await this.csrsService
					.createQuizByProfessionID(professionID)
					.then(quizInfo => {
						quiz = this.quizFactory.create(quizInfo.data)
					})
					.catch(error => {
						next(error)
					})
			}


			req.session!.save(() => {
				res.render('page/skills/skills', {quiz: quiz, professionName: professionName, message: message, errorMessage: errorMessage})
			})
		}
	}

	getEditQuestion() {
		return async (req: Request, res: Response, next: NextFunction) => {

			await this.csrsService
				.getQuestionbyID(req.params.questionID)
				.then( questionDTO => {
					const question = this.questionFactory.create(questionDTO)
					let keys = Object.values(questionDTO.answer.answers)

					req.session!.save(() => {
						res.render('page/skills/question', {
							question: question,
							keysAnswers: keys
						})
					})
				})
				.catch(error => {
					next(error)
				})
			}
	}

	EditQuestion() {
		return async (req: Request, res: Response, next: NextFunction) => {

			const question = this.questionFactory.create(req.body)

			await this.csrsService
				.editQuestion(question)
				.then( questionDTO => {
					req.session!.save(() => {
						res.redirect('/content-management/skills/update-question/success')
					})
				})
				.catch(error => {
					next(error)
				})
		}
	}

	getAddQuestion() {
		return async (req: Request, res: Response, next: NextFunction) => {
			req.session!.save(() => {
				res.render('page/skills/question', {
					courseCatalogueUrl: config.COURSE_CATALOGUE.url + '/media',
				})
			})
		}
	}

	getImage() {
		return async (req: Request, res: Response, next: NextFunction) => {
			req.session!.save(() => {
				res.render('page/skills/add-image')
			})
		}
	}

	getSkillsReport() {
		return async (req: Request, res: Response, next: NextFunction) => {
			req.session!.save(() => {
				res.render('page/skills/generate-report', {
					placeholder: new PlaceholderDateSkills(),
				})
			})
		}
	}

	// uploadAndProcess() {
	// 	return async (req: Request, res: Response, next: NextFunction) => {
	// 		let uploadedFileNotCSV: boolean = false
	//
	// 		// @ts-ignore
	// 		const uploadedFile = req.files.file
	// 		let fileExtension = uploadedFile.name.split('.')
	// 		let fileType = fileExtension[fileExtension.length - 1]
	//
	// 		if (fileType.toLowerCase() !== 'csv') {
	// 			uploadedFileNotCSV = true
	// 			req.session!.sessionFlash = {uploadedFileNotCSV}
	// 			req.session!.save(() => {
	// 				res.redirect('/content-management/skills')
	// 			})
	// 		} else {
	// 			await csvtojson()
	// 				// @ts-ignore
	// 				.fromString(req.files.file.data.toString('utf-8'))
	// 				.then(async (questions: any) => {
	// 					const opts = ['A', 'B', 'C', 'D', 'E']
	// 					let questionToSend: Question[] = []
	//
	// 					questions.forEach((question: any) => {
	// 						let choices: Choice[] = [],
	// 							answers: Choice[] = []
	// 						opts.forEach((o: string) => {
	// 							if (question['CHOICE ' + o]) {
	// 								choices.push(new Choice(question['CHOICE ' + o].replace(/(\r\n|\n|\r)/gm)))
	// 							}
	// 							if (question['ANSWER ' + o] === 'YES') {
	// 								answers.push(new Choice(question['CHOICE ' + o].replace(/(\r\n|\n|\r)/gm)))
	// 							}
	// 						})
	// 						questionToSend.push(
	// 							new Question(
	// 								question.TYPE,
	// 								question.QUESTION,
	// 								question['LEARNING NAME'],
	// 								question['LEARNING REFERENCE'],
	// 								question['THEME'],
	// 								question['WHY'],
	// 								choices,
	// 								answers
	// 							)
	// 						)
	// 					})
	//
	// 					const policyProfession = new Profession()
	//
	// 					await this.csrsService
	// 						.getAreasOfWork()
	// 						.then(professions => {
	// 							professions.forEach((profession: Profession) => {
	// 								if (profession.name.toLowerCase() === 'policy') {
	// 									let professionHref = profession.href.split('/')
	// 									let professionId = professionHref[professionHref.length - 1]
	// 									policyProfession.id = parseInt(professionId, 0)
	// 								}
	// 							})
	// 						})
	// 						.catch(error => {
	// 							next(error)
	// 						})
	//
	// 					const quiz = new Quiz()
	// 					quiz.profession = policyProfession
	// 					quiz.questions = questionToSend
	//
	// 					await this.csrsService
	// 						.postSkills(quiz)
	// 						.then(() => {
	// 							res.redirect('/content-management/skills/success')
	// 						})
	// 						.catch(error => {
	// 							next(error)
	// 						})
	// 				})
	// 		}
	// 	}
	// }

	getEditQuitDescription() {
		return async (req: Request, res: Response, next: NextFunction) => {
			req.session!.save(() => {
				res.render('page/skills/edit-quiz-description')
			})
		}
	}
}
