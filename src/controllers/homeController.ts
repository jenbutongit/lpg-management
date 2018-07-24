import {Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {CoursePageResults} from '../learning-catalogue/model/coursePageResults'

export class HomeController {
	learningCatalogue: LearningCatalogue

	constructor(learningCatalogue: LearningCatalogue) {
		this.learningCatalogue = learningCatalogue
	}

	public index() {
		const self = this

		return async (request: Request, response: Response) => {
			let page = 0
			let size = 10

			if (request.query.p) {
				page = request.query.p
			}
			if (request.query.s) {
				size = request.query.s
			}
			const pageResults: CoursePageResults<
				Course
			> = await self.learningCatalogue.listAll(page, size)

			response.render('page/index', {
				pageResults,
			})
		}
	}
}
