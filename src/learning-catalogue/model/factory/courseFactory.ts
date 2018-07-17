import {Course} from '../course'
import {ModuleFactory} from './moduleFactory'
import {EventFactory} from './eventFactory'
import {AudienceFactory} from './audienceFactory'

export class CourseFactory {
	private _eventFactory: EventFactory
	private _audienceFactory: AudienceFactory
	private _moduleFactory: ModuleFactory

	constructor() {
		this._eventFactory = new EventFactory()
		this._audienceFactory = new AudienceFactory()
		this._moduleFactory = new ModuleFactory(
			this.audienceFactory,
			this._eventFactory
		)

		this.create = this.create.bind(this)
	}

	create(data: any) {
		const course: Course = new Course()

		course.id = data.id
		course.description = data.description
		course.learningOutcomes = data.learningOutcomes
		course.shortDescription = data.shortDescription
		course.title = data.title
		course.modules = (data.modules || []).map(this._moduleFactory.create)

		return course
	}

	get eventFactory(): EventFactory {
		return this._eventFactory
	}

	set eventFactory(value: EventFactory) {
		this._eventFactory = value
	}

	get audienceFactory(): AudienceFactory {
		return this._audienceFactory
	}

	set audienceFactory(value: AudienceFactory) {
		this._audienceFactory = value
	}

	get moduleFactory(): ModuleFactory {
		return this._moduleFactory
	}

	set moduleFactory(value: ModuleFactory) {
		this._moduleFactory = value
	}
}
