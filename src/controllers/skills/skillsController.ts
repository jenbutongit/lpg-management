import {NextFunction, Request, Response, Router} from 'express'
import {CsrsService} from '../../csrs/service/csrsService'
// import * as csvtojson from 'csvtojson'
import {PlaceholderDateSkills} from '../../learning-catalogue/model/placeholderDateSkills'
// import {Validate} from '../formValidator'
import {FormController} from '../formController'
import {Validator} from '../../learning-catalogue/validator/validator'
import {Course} from '../../learning-catalogue/model/course'
import {QuestionFactory} from './questionFactory'
import {Quiz} from './quiz'

export class SkillsController implements FormController {
	csrsService: CsrsService
	validator: Validator<Course>
	router: Router
	questionFactory: QuestionFactory

	constructor(csrsService: CsrsService, questionFactory: QuestionFactory) {
		this.router = Router()
		this.configureRouterPaths()
		this.csrsService = csrsService
		// this.validator = courseValidator
		this.questionFactory = questionFactory
	}

	private configureRouterPaths() {
		this.router.get('/content-management/skills', this.getSkills())
		// this.router.post('/content-management/skills', this.uploadAndProcess())
		this.router.get('/content-management/skills/success', this.getSkillsSuccess())
		this.router.get('/content-management/skills/generate-report', this.getSkillsReport())
		this.router.get('/content-management/skills/add-new-question', this.getAddQuestion())
		this.router.post('/content-management/skills/add-new-question', this.AddQuestion())
		this.router.get('/content-management/skills/add-image', this.getImage())
	}

	AddQuestion() {
		console.log('This is running ')
		return async (req: Request, res: Response, next: NextFunction) => {
			const question = this.questionFactory.create(req.body)

			await this.csrsService
				.postQuestion(question)
				.then(() => {
					res.redirect('/content-management/skills/success')
				})
				.catch(error => {
					next(error)
				})
		}
	}

	getSkills() {
		return async (req: Request, res: Response, next: NextFunction) => {
			await this.csrsService
				.postSkills(3)
				.then(() => {
					res.render('page/skills/skills')
				})
				.catch(error => {
					next(error)
				})
			//
			// req.session!.save(() => {
			// 	res.render('page/skills/skills')
			// })
		}
	}

	getAddQuestion() {
		return async (req: Request, res: Response, next: NextFunction) => {
			req.session!.save(() => {
				res.render('page/skills/add-new-question')
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

	getSkillsSuccess() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.render('page/skills/success')
		}
	}
}
