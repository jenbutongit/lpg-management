import {IsNotEmpty} from 'class-validator'

export class Profession {
	id: number

	@IsNotEmpty({
		groups: ['all', 'name'],
		message: 'professions.validation.name.empty',
	})
	name: string
	parent: Profession
	children: Profession[]
}