import {Module} from './module'
import {IsNotEmpty, MaxLength} from 'class-validator'
import {Audience} from './audience'

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
	modules: Module[]
	audiences: Audience[]

	getCost() {
		return this.modules
			.map(module => module.cost)
			.reduce(
				(acc, moduleCost) =>
					Object.is(acc, undefined) && Object.is(moduleCost, undefined)
						? undefined
						: (acc || 0) + (moduleCost || 0),
				undefined
			)
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
}
