import * as express from 'express'
import {Course} from './learning-catalogue/model/course'
import {LearningProvider} from './learning-catalogue/model/learningProvider'
import {CancellationPolicy} from './learning-catalogue/model/cancellationPolicy'
import {TermsAndConditions} from './learning-catalogue/model/termsAndConditions'

export interface ContentRequest extends express.Request {
	course: Course
	learningProvider: LearningProvider
	cancellationPolicy: CancellationPolicy
	termsAndConditions: TermsAndConditions
}
