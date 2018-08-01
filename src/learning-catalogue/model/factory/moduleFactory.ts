import {Module} from '../module'
import {AudienceFactory} from './audienceFactory'
import {EventFactory} from './eventFactory'
import {FaceToFaceModule} from '../faceToFaceModule'
import {VideoModule} from '../videoModule'
import {LinkModule} from '../linkModule'
import {FileModule} from '../fileModule'
import {ELearningModule} from '../eLearningModule'

export class ModuleFactory {
	private audienceFactory: AudienceFactory
	private eventFactory: EventFactory

	constructor(audienceFactory: AudienceFactory, eventFactory: EventFactory) {
		this.audienceFactory = audienceFactory
		this.eventFactory = eventFactory

		this.defaultCreate = this.defaultCreate.bind(this)
	}

	private defaultCreate(data: any) {
		const module: Module = new Module()
		module.id = data.id
		module.type = data.type
		module.title = data.title
		module.description = data.description
		module.duration = data.duration
		module.price = data.price
		module.audiences = (data.audiences || []).map(
			this.audienceFactory.create
		)

		return module
	}

	public create(data: any): any {
		return this.methods[data.type](data)
	}

	private methods: ModuleTypeToCreateMethodMap = {
		video: (data: any): VideoModule => {
			const module = this.defaultCreate(data) as VideoModule
			module.location = data.location
			return module
		},
		link: (data: any): LinkModule => {
			const module = this.defaultCreate(data) as LinkModule
			module.location = data.location
			return module
		},
		file: (data: any): FileModule => {
			const module = this.defaultCreate(data) as FileModule
			module.url = data.url
			module.fileSize = data.fileSize
			return module
		},
		'face-to-face': (data: any): FaceToFaceModule => {
			const module = this.defaultCreate(data) as FaceToFaceModule
			module.events = (data.events || []).map(this.eventFactory.create)
			module.productCode = data.productCode

			return module
		},
		elearning: (data: any): ELearningModule => {
			const module = this.defaultCreate(data) as ELearningModule
			module.startPage = data.startPage
			return module
		},
	}
}

interface ModuleTypeToCreateMethodMap {
	[key: string]: any
}
