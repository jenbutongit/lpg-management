import {Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {DefaultPageResults} from '../learning-catalogue/model/defaultPageResults'

export class HomeController {
	learningCatalogue: LearningCatalogue

	constructor(learningCatalogue: LearningCatalogue) {
		this.learningCatalogue = learningCatalogue
	}

	public index() {
		const self = this

		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			let page = 0
			let size = 10

			if (request.query.p) {
				page = request.query.p
			}
			if (request.query.s) {
				size = request.query.s
			}
			const pageResults: DefaultPageResults<
				Course
			> = await self.learningCatalogue.listAll(page, size)

			response.render('page/index', {
				pageResults,
			})
		}
	}

	public course() {
		return async (request: Request, response: Response) => {
			response.render('page/course', {})
		}
	}
}
