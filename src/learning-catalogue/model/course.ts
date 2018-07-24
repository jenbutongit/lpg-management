import {Module} from './module'

export class Course {
	private _id: string
	private _title: string
	private _shortDescription: string
	private _description: string
	private _duration: number
	private _learningOutcomes: string
	private _price: number | 'Free'
	private _modules: Module[]

	get id(): string {
		return this._id
	}

	set id(value: string) {
		this._id = value
	}

	get title(): string {
		return this._title
	}

	set title(value: string) {
		this._title = value
	}

	get shortDescription(): string {
		return this._shortDescription
	}

	set shortDescription(value: string) {
		this._shortDescription = value
	}

	get description(): string {
		return this._description
	}

	set description(value: string) {
		this._description = value
	}

	get duration(): number {
		return this._duration
	}

	set duration(value: number) {
		this._duration = value
	}

	get learningOutcomes(): string {
		return this._learningOutcomes
	}

	set learningOutcomes(value: string) {
		this._learningOutcomes = value
	}

	get price() {
		return this._price
	}

	set price(value) {
		this._price = value
	}

	get modules(): Module[] {
		return this._modules
	}

	set modules(value: Module[]) {
		this._modules = value
	}
}
