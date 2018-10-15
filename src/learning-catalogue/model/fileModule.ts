import {Module} from './module'
import {IsNotEmpty, IsPositive, IsUrl} from 'class-validator'

export class FileModule extends Module {
	@IsNotEmpty({
		groups: ['all', 'url'],
		message: 'validation_module_url_empty',
	})
	@IsUrl({
		require_protocol: false,
		require_tld: true,
		allow_underscores: true,
		allow_trailing_dot: false
	},{
		groups: ['all', 'url'],
		message: 'validation_module_url_invalid',
	})
	url: string

	@IsNotEmpty({
		groups: ['all', 'mediaId'],
		message: 'validation_module_mediaId_empty',
	})
	mediaId: string

	@IsNotEmpty({
		groups: ['all', 'fileSize'],
		message: 'validation_module_fileSize_empty',
	})
	@IsPositive({
		groups: ['all', 'fileSize'],
		message: 'validation_module_fileSize_positive',
	})
	fileSize: number

	type: Module.Type.FILE
}
