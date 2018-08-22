import {Module} from './module'
import {IsNotEmpty} from 'class-validator'

export class VideoModule extends Module {
	@IsNotEmpty({
		groups: ['all', 'url'],
		message: 'validation.module.url.empty',
	})
	url: string
}
