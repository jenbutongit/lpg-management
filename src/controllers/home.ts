import {Request, Response} from 'express'
import {Pagination} from '../lib/pagination'

export class HomeController {
	public index() {
		return (request: Request, response: Response) => {
			let searchResults: any = {
				combinedResults: [],
				page: 0,
				results: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
				size: 10,
				totalResults: 10,
			}
			const pagination = new Pagination()
			const paginatedResults = pagination.calculatePaginatedResults(
				searchResults
			)

			response.render('page/index', {paginatedResults, searchResults})
		}
	}
}
