import {IsNotEmpty} from 'class-validator'

export class Provider {
	public id: string

	@IsNotEmpty({
		groups: ['all', 'name'],
		message: 'validation.provider.name.empty',
	})
	public name: string
}
