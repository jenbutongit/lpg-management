export interface PageResults<T> {
	page: number
	results: T[]
	size: number
	totalResults: number
}
