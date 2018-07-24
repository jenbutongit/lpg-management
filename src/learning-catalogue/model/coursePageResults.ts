import {PageResults} from './PageResults'

export class CoursePageResults<Course> implements PageResults<Course> {
	private _page: number
	private _results: Course[]
	private _size: number
	private _totalResults: number

	get page(): number {
		return this._page
	}

	set page(value: number) {
		this._page = value
	}

	get results(): Course[] {
		return this._results
	}

	set results(value: Course[]) {
		this._results = value
	}

	get size(): number {
		return this._size
	}

	set size(value: number) {
		this._size = value
	}

	get totalResults(): number {
		return this._totalResults
	}

	set totalResults(value: number) {
		this._totalResults = value
	}

	getRangeStart() {
		return this._page * this._size + 1
	}

	getRangeEnd() {
		return this._page * this._size + this.getLength()
	}

	getPageCount() {
		return Math.ceil(this._totalResults / this._size)
	}

	getLength() {
		return this._results.length
	}

	getNextPage() {
		return +this.page + 1
	}

	getPreviousPage() {
		return +this.page - 1
	}
}
