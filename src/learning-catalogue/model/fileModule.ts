import {Module} from './module'
import {IsNotEmpty, IsPositive} from 'class-validator'

export class FileModule extends Module {
	@IsNotEmpty({
		groups: ['all', 'url'],
		message: 'validation_module_url_empty',
	})
	url: string

	@IsNotEmpty({
		groups: ['all', 'title'],
		message: 'validation_module_title_empty',
	})
	title: string

	@IsNotEmpty({
		groups: ['all', 'description'],
		message: 'validation_module_description_empty',
	})
	description: string

	@IsNotEmpty({
		groups: ['all', 'fileSize'],
		message: 'validation_module_fileSize_empty',
	})
	@IsPositive({
		groups: ['all', 'fileSize'],
		message: 'validation_module_fileSize_positive',
	})
	fileSize: number
}
