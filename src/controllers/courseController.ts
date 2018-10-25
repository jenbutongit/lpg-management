import {Request, Response, Router} from 'express'
import {CourseFactory} from '../learning-catalogue/model/factory/courseFactory'
import {LearningCatalogue} from '../learning-catalogue'
import {Course} from '../learning-catalogue/model/course'
import {Validator} from '../learning-catalogue/validator/validator'
import {Module} from '../learning-catalogue/model/module'
import {CourseService} from '../lib/courseService'
import {CsrsService} from '../csrs/service/csrsService'
import {Audience} from '../learning-catalogue/model/audience'
import {DateTime} from '../lib/dateTime'

export class CourseController {
	learningCatalogue: LearningCatalogue
	courseValidator: Validator<Course>
	courseFactory: CourseFactory
	router: Router
	courseService: CourseService
	csrsService: CsrsService

	constructor(
		learningCatalogue: LearningCatalogue,
		courseValidator: Validator<Course>,
		courseFactory: CourseFactory,
		courseService: CourseService,
		csrsService: CsrsService
	) {
		this.learningCatalogue = learningCatalogue
		this.courseValidator = courseValidator
		this.courseFactory = courseFactory
		this.courseService = courseService
		this.csrsService = csrsService
		this.router = Router()

		this.getCourseFromRouterParamAndSetOnLocals()

		this.configureRouterPaths()
	}

	private getCourseFromRouterParamAndSetOnLocals() {
		this.router.param('courseId', async (req, res, next, courseId) => {
			const course = await this.learningCatalogue.getCourse(courseId)

			if (course) {
				res.locals.course = course
				next()
			} else {
				res.sendStatus(404)
			}
		})
	}

	private configureRouterPaths() {
		this.router.get('/content-management/courses/:courseId/overview', this.courseOverview())
		this.router.get('/content-management/courses/:courseId/preview', this.coursePreview())

		this.router.get('/content-management/courses/title/:courseId?', this.getCourseTitle())
		this.router.post('/content-management/courses/title/:courseId?', this.setCourseTitle())

		this.router.get('/content-management/courses/details/:courseId?', this.getCourseDetails())

		this.router.post('/content-management/courses/details/', this.createCourseDetails())
		this.router.post('/content-management/courses/details/:courseId', this.updateCourseDetails())

		this.router.get('/content-management/courses/:courseId/sort-modules', this.sortModules())

		this.router.post('/content-management/courses/:courseId/status', this.setStatus())
		this.router.get('/content-management/courses/:courseId/sortDateRanges-modules', this.sortModules())
	}

	courseOverview() {
		return async (req: Request, res: Response) => {
			const faceToFaceModules = res.locals.course.modules.filter(
				(module: Module) => module.type == Module.Type.FACE_TO_FACE
			)
			const departmentCodeToName = await this.csrsService.getDepartmentCodeToNameMapping()
			const gradeCodeToName = await this.csrsService.getGradeCodeToNameMapping()
			const audienceIdToEvent = this.courseService.getAudienceIdToEventMapping(res.locals.course)
			const eventIdToModuleId = this.courseService.getEventIdToModuleIdMapping(res.locals.course)

			const grades = this.courseService.getUniqueGrades(res.locals.course)

			res.render('page/course/course-overview', {
				faceToFaceModules,
				AudienceType: Audience.Type,
				departmentCodeToName,
				gradeCodeToName,
				audienceIdToEvent,
				eventIdToModuleId,
				grades,
			})
		}
	}

	coursePreview() {
		return async (request: Request, response: Response) => {
			const modules: Module[] = response.locals.course.modules

			for (let module of modules) {
				module.formattedDuration = DateTime.formatDuration(module.duration)
			}

			response.render('page/course/course-preview')
		}
	}

	getCourseTitle() {
		return async (request: Request, response: Response) => {
			response.render('page/course/course-title')
		}
	}

	setCourseTitle() {
		return async (request: Request, response: Response) => {
			const errors = await this.courseValidator.check(request.body, ['title'])
			if (errors.size) {
				response.render('page/course/course-title',{
					errors: errors,
					course: request.body
				})
			} else if (request.params.courseId) {
				const course = response.locals.course
				course.title = request.body.title

				await this.learningCatalogue.updateCourse(course)

				response.redirect(`/content-management/courses/${request.params.courseId}/preview`)
			} else {
				const course = this.courseFactory.create(request.body)
				request.session!.sessionFlash = {course}
				request.session!.save(() => {
					response.redirect('/content-management/courses/details')
				})
			}
		}
	}

	getCourseDetails() {
		return async (request: Request, response: Response) => {
			response.render('page/course/course-details')
		}
	}

	createCourseDetails() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}
			const errors = await this.courseValidator.check(data, ['shortDescription', 'description'])

			if (errors.size) {
				return res.render('page/course/course-details', {
					errors: errors,
					course: data
				})
			}

			const course = this.courseFactory.create(data)
			const savedCourse = await this.learningCatalogue.createCourse(course)
			req.session!.sessionFlash = {courseAddedSuccessMessage: 'course_added_success_message'}
			req.session!.save(() => {
				res.redirect(`/content-management/courses/${savedCourse.id}/overview`)
			})
		}
	}

	updateCourseDetails() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}
			const errors = await this.courseValidator.check(data, ['title', 'shortDescription', 'description'])
			if (errors.size) {
				return res.render('page/course/course-details', {
					errors: errors,
					course: data
				})
			}

			const course = res.locals.course
			course.shortDescription = data.shortDescription
			course.description = data.description
			course.learningOutcomes = data.learningOutcomes
			course.preparation = data.preparation

			await this.learningCatalogue.updateCourse(course)

			res.redirect(`/content-management/courses/${req.params.courseId}/preview`)
		}
	}


	sortModules() {
		return async (request: Request, response: Response) => {
			await this.courseService.sortModules(request.params.courseId, request.query.moduleIds)
			return response.redirect(`/content-management/courses/${request.params.courseId}/add-module`)
		}
	}

	setStatus() {
		return async (request: Request, response: Response) => {
			const errors = await this.courseValidator.check(request.body, ['status'])

			if (errors.size) {
				request.session!.sessionFlash = {errors: errors}
				return request.session!.save(() => {
					response.redirect(`/content-management/courses/${request.params.courseId}/overview`)
				})
			}

			let course = response.locals.course
			course.status = request.body.status

			await this.learningCatalogue.updateCourse(course)
			response.redirect(`/content-management/courses/${request.params.courseId}/overview`)
		}
	}
}
