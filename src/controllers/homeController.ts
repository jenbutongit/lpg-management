import {Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {PageResults} from '../learning-catalogue/model/pageResults'
import {Value} from 'ts-json-properties'

export class HomeController {
	learningCatalogue: LearningCatalogue
	@Value('lpgUiUrl') private lpgUiUrl: String

	constructor(learningCatalogue: LearningCatalogue, lpgUiUrl: String) {
		this.learningCatalogue = learningCatalogue
		this.lpgUiUrl = lpgUiUrl
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
				lpgUiUrl: this.lpgUiUrl,
			})
		}
	}
}
