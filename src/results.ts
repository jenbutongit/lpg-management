export class Results {
	private _page: number
	private _results: number[]
	private _size: number
	private _totalResults: number

	constructor(
		page: number,
		results: number[],
		size: number,
		totalResults: number
	) {
		this._page = page
		this._results = results
		this._size = size
		this._totalResults = totalResults
	}

	get page(): number {
		return this._page
	}

	set page(value: number) {
		this._page = value
	}

	get results(): number[] {
		return this._results
	}

	set results(value: number[]) {
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
}
