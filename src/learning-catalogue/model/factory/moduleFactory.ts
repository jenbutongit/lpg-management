import {Module} from '../module'
import {AudienceFactory} from './audienceFactory'
import {EventFactory} from './eventFactory'

export class ModuleFactory {
	private audienceFactory: AudienceFactory
	private eventFactory: EventFactory

	constructor(audienceFactory: AudienceFactory, eventFactory: EventFactory) {
		this.audienceFactory = audienceFactory
		this.eventFactory = eventFactory
	}

	create(data: any) {
		const module: Module = new Module()
		module.id = data.id
		module.type = data.type
		module.productCode = data.productCode
		module.title = data.title
		module.description = data.description
		module.duration = data.duration
		module.price = data.price
		module.audiences = (data.audiences || []).map(this.audienceFactory.create)
		module.events = (data.events || []).map(this.eventFactory.create)

		return module
	}
}
