import {Results} from '../results'
import {PaginatedResult} from '../lib/paginatedResult'

export class Pagination {
	constructor() {}

	calculatePaginatedResults(searchResults: Results) {
		const paginatedResults = new PaginatedResult()

		paginatedResults.firstResult =
			searchResults.page * searchResults.size + 1
		paginatedResults.lastResult =
			searchResults.page * searchResults.size +
			searchResults.results.length
		paginatedResults.totalResults = searchResults.totalResults
		paginatedResults.pageCount =
			searchResults.totalResults / searchResults.size
		paginatedResults.endResult = paginatedResults.pageCount - 1
		paginatedResults.currentPage = searchResults.page

		return paginatedResults
	}
}
