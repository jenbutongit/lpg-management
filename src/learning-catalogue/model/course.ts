import {Module} from './module'
import {IsNotEmpty, MaxLength} from 'class-validator'
import {Audience} from './audience'
import {FaceToFaceModule} from './faceToFaceModule'
import {DateTime} from '../../lib/dateTime'

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
	price: number
	modules: Module[]
	audiences: Audience[]

	getCost() {
		const costArray = this.modules.map(module => module.price)
		return costArray.length ? costArray.reduce((p, c) => (p || 0) + (c || 0), 0) : null
	}

	getType() {
		if (!this.modules.length) {
			return 'course'
		}
		if (this.modules.length > 1) {
			return 'blended'
		}
		return this.modules[0].type
	}

	getNextAvaialableDate() {
		const now: Date = new Date(Date.now())
		for (let module of this.modules) {
			if (module.type == 'face-to-face') {
				for (const event of (<FaceToFaceModule>module).events) {
					const date: Date = new Date(Date.parse(event.dateRanges[0].date.toString()))

					if (date > now) {
						return event.dateRanges[0].date.toString()
					}
				}
			}
		}
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
		for (const audience of this.audiences) {
			if (audience.grades) {
				if (grades != '') {
					grades += ','
				}
				grades += audience.grades.toString()
			}
		}
		return grades
	}

	getAreasOfWork() {
		let areasOfWork: string = ''
		for (const audience of this.audiences) {
			if (audience.areasOfWork) {
				if (areasOfWork != '') {
					areasOfWork += ', '
				}
				areasOfWork += audience.areasOfWork.toString()
			}
		}
		return areasOfWork
	}
}
