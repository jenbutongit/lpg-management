export class PaginatedResult {
	private _firstResult: number
	private _lastResult: number
	private _totalResults: number
	private _endResult: number
	private _pageCount: number
	private _currentPage: number

	constructor() {}

	get firstResult(): number {
		return this._firstResult
	}

	set firstResult(value: number) {
		this._firstResult = value
	}

	get pageCount(): number {
		return this._pageCount
	}

	set pageCount(value: number) {
		this._pageCount = value
	}

	get lastResult(): number {
		return this._lastResult
	}

	set lastResult(value: number) {
		this._lastResult = value
	}

	get totalResults(): number {
		return this._totalResults
	}

	set totalResults(value: number) {
		this._totalResults = value
	}

	get endResult(): number {
		return this._endResult
	}

	set endResult(value: number) {
		this._endResult = value
	}

	get currentPage(): number {
		return this._currentPage
	}

	set currentPage(value: number) {
		this._currentPage = value
	}
}
