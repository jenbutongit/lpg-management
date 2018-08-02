import {Audience} from './audience'
import {IsNotEmpty, IsNumber, ValidateNested} from 'class-validator'

export class Module {
	id: string

	@IsNotEmpty({
		groups: ['all', 'type'],
		message: 'validation.module.type.empty',
	})
	type: string

	@IsNotEmpty({
		groups: ['all', 'title'],
		message: 'validation.module.title.empty',
	})
	title: string

	@IsNotEmpty({
		groups: ['all', 'description'],
		message: 'validation.module.description.empty',
	})
	description: string

	@IsNotEmpty({
		groups: ['all', 'duration'],
		message: 'validation.module.duration.empty',
	})
	@IsNumber(undefined, {
		groups: ['all', 'duration'],
		message: 'validation.module.duration.number',
	})
	duration: number

	@IsNumber(undefined, {
		groups: ['all', 'price'],
		message: 'validation.module.price.number',
	})
	price?: number

	@ValidateNested({
		groups: ['all', 'audience'],
	})
	audiences: Audience[]
}
