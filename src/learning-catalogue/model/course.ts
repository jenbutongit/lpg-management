import {Module} from './module'
import {IsIn, IsNotEmpty, MaxLength} from 'class-validator'
import {Audience} from './audience'
import {FaceToFaceModule} from './faceToFaceModule'
import {DateTime} from '../../lib/dateTime'
import {LearningProvider} from './learningProvider'
import {Status} from './status'

export class Course {
	id: string

	@IsNotEmpty({
		groups: ['all', 'title'],
		message: 'course.validation.title.empty',
	})
	title: string

	@IsNotEmpty({
		groups: ['all', 'shortDescription'],
		message: 'course.validation.shortDescription.empty',
	})
	@MaxLength(160, {
		groups: ['all', 'shortDescription'],
		message: 'course.validation.shortDescription.maxLength',
	})
	shortDescription: string

	@IsNotEmpty({
		groups: ['all', 'description'],
		message: 'course.validation.description.empty',
	})
	@MaxLength(1500, {
		groups: ['all', 'description'],
		message: 'course.validation.description.maxLength',
	})
	description: string

	duration: number
	learningOutcomes: string
	preparation: string
	modules: Module[]
	audiences: Audience[]
	learningProvider: LearningProvider

	@IsIn(['Draft', 'Published', 'Archived'], {
		groups: ['all', 'status'],
		message: 'course.validation.status.invalid',
	})
	status: Status = Status.DRAFT

	topicId: string

	getCost() {
		return this.modules.map(module => module.cost).reduce((acc: number, moduleCost) => acc + (moduleCost || 0), 0)
	}

	getType() {
		return this.modules.length > 1 ? 'blended' : this.modules.length == 1 ? this.modules[0].type : undefined
	}

	getNextAvailableDate() {
		const now: Date = new Date(Date.now())
		let earliestDate: Date
		let earliestDateString
		for (let module of this.modules) {
			if (module.type == 'face-to-face') {
				for (const event of (<FaceToFaceModule>module).events) {
					if (event.dateRanges[0]) {
						const date: Date = new Date(Date.parse(event.dateRanges[0].date.toString()))

						if (date > now && (!earliestDate! || date < earliestDate)) {
							earliestDate = date
							earliestDateString = event.dateRanges[0].date.toString()
						}
					}
				}
			}
		}
		return earliestDateString
	}

	getDuration() {
		let duration = 0
		for (const module of this.modules) {
			duration += module.duration
		}
		return DateTime.formatDuration(duration)
	}

	getGrades() {
		let grades: string = ''
		if (this.audiences) {
			for (const audience of this.audiences) {
				if (audience.grades) {
					if (grades != '') {
						grades += ','
					}
					grades += audience.grades.toString()
				}
			}
		}
		return grades
	}

	getAreasOfWork() {
		let areasOfWork: string = ''
		if (this.audiences) {
			for (const audience of this.audiences) {
				if (audience.areasOfWork) {
					if (areasOfWork != '') {
						areasOfWork += ','
					}
					areasOfWork += audience.areasOfWork.toString()
				}
			}
		}
		return areasOfWork
	}
}
