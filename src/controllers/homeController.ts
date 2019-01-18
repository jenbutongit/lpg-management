import {NextFunction, Request, Response} from 'express'
import {LearningCatalogue} from '../learning-catalogue'

import * as log4js from 'log4js'
import {Pagination} from 'lib/pagination'

export class HomeController {
	logger = log4js.getLogger('controllers/homeController')
	learningCatalogue: LearningCatalogue
	pagination: Pagination

	constructor(learningCatalogue: LearningCatalogue, pagination: Pagination) {
		this.learningCatalogue = learningCatalogue
		this.pagination = pagination
	}

	public index() {
		const self = this

		//TODO: Return empty list of results here if learning catalogue is down?
		return async (request: Request, response: Response, next: NextFunction) => {
			let {page, size} = this.pagination.getPageAndSizeFromRequest(request)

			await self.learningCatalogue
				.listCourses(page, size)
				.then(pageResults => {
					response.render('page/index', {
						pageResults,
					})
				})
				.catch(error => {
					next(error)
				})
		}
	}
}
