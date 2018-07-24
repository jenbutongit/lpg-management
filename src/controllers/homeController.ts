import {Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {PageResults} from '../learning-catalogue/model/pageResults'
import * as ctx from '../applicationContext'

export class HomeController {
	learningCatalogue: LearningCatalogue

	constructor(learningCatalogue: LearningCatalogue) {
		this.learningCatalogue = learningCatalogue
	}

	public index() {
		const self = this

		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			const pageResults: PageResults<
				Course
			> = await self.learningCatalogue.listAll()

			response.render('page/index', {
				pageResults,
				lpgUiUrl: ctx.default.lpgConfig.lpgUiUrl,
			})
		}
	}
}
