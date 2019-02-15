import {NextFunction, Request, Response, Router} from 'express'
import {AudienceFactory} from '../../learning-catalogue/model/factory/audienceFactory'
import {LearningCatalogue} from '../../learning-catalogue'
import {Audience} from '../../learning-catalogue/model/audience'
import {Validator} from '../../learning-catalogue/validator/validator'
import {CourseService} from '../../lib/courseService'
import {AudienceService} from '../../lib/audienceService'
import {CsrsService} from '../../csrs/service/csrsService'
import {DateTime} from '../../lib/dateTime'
import {Csrs} from '../../csrs'
import * as moment from 'moment'
const isValidDate = require('is-valid-date')

export class AudienceController {
	learningCatalogue: LearningCatalogue
	audienceValidator: Validator<Audience>
	audienceFactory: AudienceFactory
	courseService: CourseService
	csrsService: CsrsService
	csrs: Csrs
	router: Router

	constructor(
		learningCatalogue: LearningCatalogue,
		audienceValidator: Validator<Audience>,
		audienceFactory: AudienceFactory,
		courseService: CourseService,
		csrsService: CsrsService,
		csrs: Csrs
	) {
		this.learningCatalogue = learningCatalogue
		this.audienceValidator = audienceValidator
		this.audienceFactory = audienceFactory
		this.courseService = courseService
		this.csrsService = csrsService
		this.csrs = csrs
		this.router = Router()
		this.configurePathParametersProcessing()
		this.setRouterPaths()
	}

	private configurePathParametersProcessing() {
		this.router.param('courseId', this.courseService.findCourseByCourseIdAndAssignToResponseLocalsOrReturn404())
		this.router.param('audienceId', AudienceService.findAudienceByAudienceIdAndAssignToResponseLocalsOrReturn404())
	}

	private setRouterPaths() {
		this.router.get('/content-management/courses/:courseId/audiences/', this.getAudienceName())
		this.router.post('/content-management/courses/:courseId/audiences/', this.setAudienceName())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/configure', this.getConfigureAudience())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/organisation', this.getOrganisation())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/organisation', this.setOrganisation())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/organisation/delete', this.deleteOrganisation())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/delete', this.deleteAudienceConfirmation())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/delete', this.deleteAudience())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/area-of-work', this.getAreasOfWork())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/area-of-work', this.setAreasOfWork())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/area-of-work/delete', this.deleteAreasOfWork())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/add-core-learning', this.getCoreLearning())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/add-core-learning', this.setCoreLearning())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/core-learning/delete', this.deleteCoreLearning())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/grades', this.getGrades())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/grades', this.setGrades())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/grades/delete', this.deleteGrades())

		this.router.get('/content-management/courses/:courseId/audiences/:audienceId/required-learning', this.getRequiredLearning())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/required-learning', this.setRequiredLearning())
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/required-learning/delete', this.deleteRequiredLearning())
	}

	getAudienceName() {
		return async (req: Request, res: Response) => {
			res.render('page/course/audience/audience-name')
		}
	}

	setAudienceName() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}
			const errors = await this.audienceValidator.check(data, ['audience.name'])
			const audience = this.audienceFactory.create(data)

			if (errors.size > 0) {
				req.session!.sessionFlash = {errors, audience}
				req.session!.save(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/`)
				})
			} else {
				audience.type = Audience.Type.OPEN
				const savedAudience = await this.learningCatalogue.createAudience(req.params.courseId, audience)

				req.session!.save(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${savedAudience.id}/configure`)
				})
			}
		}
	}

	getConfigureAudience() {
		return async (req: Request, res: Response) => {
			const departmentCodeToName = await this.csrsService.getDepartmentCodeToNameMapping()
			const gradeCodeToName = await this.csrsService.getGradeCodeToNameMapping()
			const audienceIdToEvent = this.courseService.getAudienceIdToEventMapping(res.locals.course)
			res.render('page/course/audience/configure-audience', {
				AudienceType: Audience.Type,
				departmentCodeToName,
				gradeCodeToName,
				audienceIdToEvent,
			})
		}
	}

	getOrganisation() {
		return async (req: Request, res: Response) => {
			const organisations = await this.csrs.listOrganisationalUnitsForTypehead()
			res.render('page/course/audience/add-organisation', {organisationalUnits: organisations})
		}
	}

	setOrganisation() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const departments = req.body.organisation === 'all' ? await this.getAllOrganisationCodes() : [req.body['parent']]

			res.locals.audience.departments = departments

			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
				})
				.catch(error => {
					next(error)
				})
		}
	}

	deleteOrganisation() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.locals.audience.departments = []
			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
				})
				.catch(error => {
					next(error)
				})
		}
	}

	private async getAllOrganisationCodes(): Promise<string[]> {
		const organisations = await this.csrsService.getOrganisations()
		return organisations._embedded.organisationalUnits.map((org: any) => {
			return org.code
		})
	}

	deleteAudienceConfirmation() {
		return async (req: Request, res: Response) => {
			res.render('page/course/audience/delete-audience-confirmation')
		}
	}

	deleteAudience() {
		return async (req: Request, res: Response, next: NextFunction) => {
			await this.learningCatalogue
				.deleteAudience(req.params.courseId, req.params.audienceId)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/overview`)
				})
				.catch(error => {
					next(error)
				})
		}
	}

	getAreasOfWork() {
		return async (req: Request, res: Response) => {
			const areasOfWork = await this.csrsService.getAreasOfWork()
			res.render('page/course/audience/add-area-of-work', {areasOfWork})
		}
	}

	setAreasOfWork() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const areaOfWork = req.body['area-of-work']
			if (await this.csrsService.isAreaOfWorkValid(areaOfWork)) {
				res.locals.audience.areasOfWork = [areaOfWork]
				await this.learningCatalogue
					.updateAudience(res.locals.course.id, res.locals.audience)
					.then(() => {
						res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
					})
					.catch(error => {
						next(error)
					})
			} else {
				next(new Error('Area of work is not valid'))
			}
		}
	}

	deleteAreasOfWork() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.locals.audience.areasOfWork = []
			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`))
				.catch(error => next(error))
		}
	}

	getGrades() {
		return async (req: Request, res: Response) => {
			const grades = await this.csrsService.getGrades()
			res.render('page/course/audience/add-grades', {grades})
		}
	}

	setGrades() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const gradeCodes = Array.isArray(req.body.grades) ? req.body.grades : [req.body.grades]
			if (gradeCodes && gradeCodes.length > 0) {
				const allGradesValid = await gradeCodes.reduce(
					async (allValid: boolean, gradeCode: string) => (allValid ? await this.csrsService.isGradeCodeValid(gradeCode) : false),
					true
				)
				if (allGradesValid) {
					res.locals.audience.grades = gradeCodes
					await this.learningCatalogue
						.updateAudience(res.locals.course.id, res.locals.audience)
						.then(() => {
							res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
						})
						.catch(error => next(error))
				}
			} else {
				next(new Error('Grade not valid'))
			}
		}
	}

	deleteGrades() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.locals.audience.grades = []
			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
				})
				.catch(error => next(error))
		}
	}

	getCoreLearning() {
		return async (request: Request, response: Response) => {
			const interests = await this.csrsService.getCoreLearning()
			response.render('page/course/audience/add-core-learning', {interests})
		}
	}

	setCoreLearning() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const interests = Array.isArray(req.body.interests) ? req.body.interests : [req.body.interests]
			if (interests) {
				const allInterestsValid = await interests.reduce(
					async (allValid: boolean, interest: string) => (allValid ? await this.csrsService.isCoreLearningValid(interest) : false),
					true
				)
				if (allInterestsValid) {
					res.locals.audience.interests = interests
					await this.learningCatalogue
						.updateAudience(res.locals.course.id, res.locals.audience)
						.then(() => {
							res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
						})
						.catch(error => next(error))
				} else {
					next(new Error('Interests not valid'))
				}
			} else {
				next(new Error('Interests not present'))
			}
		}
	}

	deleteCoreLearning() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.locals.audience.interests = []

			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
				})
				.catch(error => next(error))
		}
	}

	getRequiredLearning() {
		return async (req: Request, res: Response) => {
			res.render('page/course/audience/add-required-learning', {exampleYear: new Date(Date.now()).getFullYear() + 1})
		}
	}

	setRequiredLearning() {
		return async (req: Request, res: Response, next: NextFunction) => {
			const data = {
				...req.body,
			}

			if (data.year || data.month || data.day) {
				const audience: Audience = new Audience()
				audience.requiredBy = new Date(data.year, data.month, data.day)

				const errors = await this.audienceValidator.check(audience, ['audience.requiredBy'])
				if (!isValidDate(`${data.day}/${data.month}/${data.year}`)) {
					errors.fields.requiredBy = ['audience.validation.requiredBy.invalidDate']
					errors.size++
				}

				if (errors.size) {
					req.session!.sessionFlash = {errors}
					return req.session!.save(() => {
						res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/required-learning`)
					})
				}

				res.locals.audience.requiredBy = DateTime.yearMonthDayToDate(data.year, data.month, data.day).toDate()
			}

			if (data.years || data.months) {
				res.locals.audience.frequency = moment.duration(parseInt(data.years || 0) * 12 + parseInt(data.months || 0), 'months')
			}

			res.locals.audience.type = Audience.Type.REQUIRED_LEARNING

			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
				})
				.catch(error => next(error))
		}
	}

	deleteRequiredLearning() {
		return async (req: Request, res: Response, next: NextFunction) => {
			res.locals.audience.type = Audience.Type.OPEN
			res.locals.audience.requiredBy = undefined
			res.locals.audience.frequency = undefined

			await this.learningCatalogue
				.updateAudience(res.locals.course.id, res.locals.audience)
				.then(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`)
				})
				.catch(error => next(error))
		}
	}
}
