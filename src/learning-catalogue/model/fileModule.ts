import {Module} from './module'
import {IsNotEmpty, IsPositive} from 'class-validator'

export class FileModule extends Module {
	@IsNotEmpty({
		groups: ['all', 'url'],
		message: 'validation.module.url.empty',
	})
	url: string

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
		groups: ['all', 'fileSize'],
		message: 'validation.module.fileSize.empty',
	})
	@IsPositive({
		groups: ['all', 'fileSize'],
		message: 'validation.module.fileSize.positive',
	})
	fileSize: number
}
