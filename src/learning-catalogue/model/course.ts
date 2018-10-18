import {Module} from './module'
import {IsNotEmpty, MaxLength} from 'class-validator'
import {Audience} from './audience'
import {FaceToFaceModule} from './faceToFaceModule'
import {DateTime} from '../../lib/dateTime'
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
	price: number
	modules: Module[]
	audiences: Audience[]
	status: Status = Status.DRAFT

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
