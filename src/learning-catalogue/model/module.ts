import {Audience} from './audience'

export class Module {
	id: string
	type: string
	title: string
	description: string
	duration: number
	price?: number
	audiences: Audience[]
}
