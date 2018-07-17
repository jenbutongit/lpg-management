export class Audience {
	private _areasOfWork: string[]
	private _departments: string[]
	private _grades: string[]
	private _interests: string[]
	private _mandatory: boolean

	private _requiredBy?: Date | null
	private _frequency?: string | null

	get areasOfWork(): string[] {
		return this._areasOfWork
	}

	set areasOfWork(value: string[]) {
		this._areasOfWork = value
	}

	get departments(): string[] {
		return this._departments
	}

	set departments(value: string[]) {
		this._departments = value
	}

	get grades(): string[] {
		return this._grades
	}

	set grades(value: string[]) {
		this._grades = value
	}

	get interests(): string[] {
		return this._interests
	}

	set interests(value: string[]) {
		this._interests = value
	}

	get mandatory(): boolean {
		return this._mandatory
	}

	set mandatory(value: boolean) {
		this._mandatory = value
	}

	get requiredBy(): Date | null | undefined {
		return this._requiredBy
	}

	set requiredBy(value: Date | null | undefined) {
		this._requiredBy = value
	}

	get frequency(): string | null | undefined {
		return this._frequency
	}

	set frequency(value: string | null | undefined) {
		this._frequency = value
	}
}
