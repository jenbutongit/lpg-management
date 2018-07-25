import {Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {PageResults} from '../learning-catalogue/model/pageResults'

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
			})
		}
	}

	public addCourse() {
		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			response.render('page/add-course-title', {})
		}
	}

	public addCourseDetails() {
		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response) => {
			response.render('page/add-course-details', {})
		}
	}
}