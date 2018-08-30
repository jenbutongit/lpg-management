import {Audience} from './audience'
import {IsIn, IsNotEmpty, IsPositive, ValidateNested} from 'class-validator'

export class Module {
	id: string

	@IsNotEmpty({
		groups: ['all', 'type'],
		message: 'validation.module.type.empty',
	})
	@IsIn(['face-to-face', 'link', 'video', 'elearning', 'file'], {
		groups: ['all', 'type'],
		message: 'validation.module.type.validType',
	})
	type: 'face-to-face' | 'link' | 'video' | 'elearning' | 'file'

	@IsNotEmpty({
		groups: ['all', 'title'],
		message: 'validation_module_title_empty',
	})
	title: string

	@IsNotEmpty({
		groups: ['all', 'description'],
		message: 'validation.module.description.empty',
	})
	description: string

	@IsPositive({
		groups: ['all', 'duration'],
		message: 'validation.module.duration.positive',
	})
	@IsNotEmpty({
		groups: ['all', 'duration'],
		message: 'validation.module.duration.empty',
	})
	duration: number

	price?: number

	optional: boolean

	@ValidateNested({
		groups: ['all', 'audiences'],
	})
	audiences: Audience[]

	events: Event[] = []
}
