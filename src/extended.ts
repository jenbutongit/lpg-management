import * as express from 'express'
import {Course} from './learning-catalogue/model/course'

export interface CourseRequest extends express.Request {
	course: Course
}
