import {NextFunction, Request, Response, Router} from 'express'
import {CsrsService} from "../csrs/service/csrsService";
import * as csvtojson from "csvtojson"

class Choice {
	value: string

	constructor(val: string) {
		this.value = val
	}
}
class Profession {
	id: number
	name: string
	href: string
}

class Quiz {
	profession: Profession
	questions: Question[]
}
class Question {
	type: string
	value: string
	learningName: string
	learningReference: string
	choices: Choice[]
	answers: Choice[]

	constructor(type: string, val: string, learnName: string, learnRef: string, choices: Choice[], answers: Choice[]) {
		this.answers = answers
		this.choices = choices
		this.learningName = learnName
		this.learningReference = learnRef
		this.type = type
		this.value = val
	}
}

export class SkillsController {
	csrsService: CsrsService
	router: Router

	constructor(
		csrsService: CsrsService
	) {
		this.router = Router()
		this.configureRouterPaths()
		this.csrsService = csrsService
	}

	private configureRouterPaths() {
		this.router.get('/content-management/skills', this.getSkills())
		this.router.post('/content-management/skills', this.uploadAndProcess())
	}

	getSkills() {
		return async (req: Request, res: Response) => {
			const areasOfWork = await this.csrsService.getAreasOfWork()
			res.render('page/skills/skills', areasOfWork)
		}
	}

	uploadAndProcess() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.render('page/skills/success')
			// @ts-ignore
			await csvtojson().fromString(req.files.file.data.toString('utf-8')).then(async (questions: any) => {

				const opts = ['A', 'B', 'C', 'D', 'E']
				let questionToSend: Question[] = []

				questions.forEach((question: any) => {
					let choices: Choice[] = [], answers: Choice[] = [];
					opts.forEach((o: string) => {
						if (question['CHOICE ' + o]) {
							choices.push(new Choice(question['CHOICE ' + o]))
						}
						if (question['ANSWER ' + o] === 'YES') {
							answers.push(new Choice(question['ANSWER ' + o]))
						}
					})
					questionToSend.push(
						new Question(question.TYPE, question.QUESTION, question['LEARNING NAME'], question['LEARNING REFERENCE'], choices, answers)
					)
				})

				const policyProfession = new Profession()

				await this.csrsService.getAreasOfWork()
					.then(professions => {
						professions.forEach((profession: Profession) => {
							if (profession.name.toLowerCase() === "analysis") {
								let professionHref = profession.href.split('/')
								let professionId = professionHref[professionHref.length - 1]
								policyProfession.id = parseInt(professionId, 0)
							}
						})
					}).catch(error => {
						next(error)
					})

				const quiz = new Quiz()
				quiz.profession = policyProfession
				quiz.questions = questionToSend

				console.log("Quiz: ", quiz)
				await this.csrsService.postSkills(quiz).then(() => {
					res.render('page/skills/success')
				}).catch(error => {
					next(error)
				})
			})
		}
	}
}
