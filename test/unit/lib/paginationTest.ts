import {describe, it} from 'mocha'
import {expect} from 'chai'
import {Pagination} from '../../../src/lib/pagination'

describe('Pagination tests', () => {
	it('should return correct pagination results with given results', () => {
		let searchResults: any = {
			combinedResults: [],
			page: 0,
			results: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			size: 10,
			totalResults: 10,
		}

		const pagination: Pagination = new Pagination()

		const paginatedResults = pagination.calculatePaginatedResults(searchResults)

		expect(paginatedResults.totalResults).to.be.eql(10)
		expect(paginatedResults.firstResult).to.be.eql(1)
		expect(paginatedResults.lastResult).to.be.eql(10)
		expect(paginatedResults.pageCount).to.be.eql(1)
		expect(paginatedResults.currentPage).to.be.eql(0)
	})
})
