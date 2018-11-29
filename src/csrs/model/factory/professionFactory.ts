import {Profession} from '../profession'

export class ProfessionFactory {
	constructor() {
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const profession: Profession = new Profession()

		profession.id = data.id
		profession.name = data.name

		if (data.hasOwnProperty('parent') && data.parent != null) {
			profession.parent = this.create(data.parent)
		}

		return profession
	}
}