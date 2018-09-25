import {Request, Response, Router} from 'express'
import {AudienceFactory} from '../../learning-catalogue/model/factory/audienceFactory'
import {LearningCatalogue} from '../../learning-catalogue'
import {Audience} from '../../learning-catalogue/model/audience'
import {Validator} from '../../learning-catalogue/validator/validator'
import {CourseService} from 'lib/courseService'
import {AudienceService} from 'lib/audienceService'
import {CsrsService} from '../../csrs/service/csrsService'

const jsonpath = require('jsonpath')

export class AudienceController {
	learningCatalogue: LearningCatalogue
	audienceValidator: Validator<Audience>
	audienceFactory: AudienceFactory
	courseService: CourseService
	audienceService: AudienceService
	csrsService: CsrsService
	router: Router

	constructor(
		learningCatalogue: LearningCatalogue,
		audienceValidator: Validator<Audience>,
		audienceFactory: AudienceFactory,
		courseService: CourseService,
		audienceService: AudienceService,
		csrsService: CsrsService
	) {
		this.learningCatalogue = learningCatalogue
		this.audienceValidator = audienceValidator
		this.audienceFactory = audienceFactory
		this.courseService = courseService
		this.audienceService = audienceService
		this.csrsService = csrsService
		this.router = Router()
		this.configurePathParametersProcessing()
		this.setRouterPaths()
	}

	private configurePathParametersProcessing() {
		this.router.param('courseId', this.courseService.findCourseByCourseIdAndAssignToResponseLocalsOrReturn404())
		this.router.param(
			'audienceId',
			this.audienceService.findAudienceByAudienceIdAndAssignToResponseLocalsOrReturn404()
		)
	}

	private setRouterPaths() {
		this.router.get('/content-management/courses/:courseId/audiences', this.getAudienceName())
		this.router.post('/content-management/courses/:courseId/audiences', this.setAudienceName())
		this.router.get('/content-management/courses/:courseId/audiences/type', this.getAudienceType())
		this.router.post('/content-management/courses/:courseId/audiences/type', this.setAudienceType())
		this.router.get(
			'/content-management/courses/:courseId/audiences/:audienceId/configure',
			this.getConfigureAudience()
		)
		this.router.get(
			'/content-management/courses/:courseId/audiences/:audienceId/delete',
			this.deleteAudienceConfirmation()
		)
		this.router.post('/content-management/courses/:courseId/audiences/:audienceId/delete', this.deleteAudience())
		this.router.get(
			'/content-management/courses/:courseId/audiences/:audienceId/organisation',
			this.getOrganisation()
		)
		this.router.post(
			'/content-management/courses/:courseId/audiences/:audienceId/organisation',
			this.setOrganisation()
		)
		this.router.get('/content-management/courses/:courseId/audience/add-area-of-work', this.getAreasOfWork())
		this.router.post('/content-management/courses/:courseId/audience/add-area-of-work', this.setAreasOfWork())
	}

	public getAudienceName() {
		return async (req: Request, res: Response) => {
			res.render('page/course/audience/audience-name')
		}
	}

	public setAudienceName() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}
			const errors = await this.audienceValidator.check(data, ['audience.name'])
			const audience = this.audienceFactory.create(data)

			if (errors.size > 0) {
				req.session!.sessionFlash = {errors, audience}
				req.session!.save(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences`)
				})
			} else {
				const savedAudience = await this.learningCatalogue.createAudience(req.params.courseId, audience)
				req.session!.sessionFlash = {audience: savedAudience}
				req.session!.save(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/type`)
				})
			}
		}
	}

	public getAudienceType() {
		return async (request: Request, response: Response) => {
			response.render('page/course/audience/audience-type')
		}
	}

	public setAudienceType() {
		return async (req: Request, res: Response) => {
			const data = {...req.body}
			const errors = await this.audienceValidator.check(data, ['audience.type'])
			const audience = this.audienceFactory.create(data)

			if (errors.size > 0) {
				req.session!.sessionFlash = {errors, audienceName: audience.name}
				req.session!.save(() => {
					res.redirect(`/content-management/courses/${req.params.courseId}/audiences/type`)
				})
			} else {
				const savedAudience = await this.learningCatalogue.createAudience(req.params.courseId, audience)
				req.session!.sessionFlash = {audience: savedAudience}
				req.session!.save(() => {
					res.redirect(
						`/content-management/courses/${req.params.courseId}/audiences/${savedAudience.id}/configure`
					)
				})
			}
		}
	}

	public getConfigureAudience() {
		return async (req: Request, res: Response) => {
			const organisations = await this.csrsService.getOrganisations()
			const departmentsAsString = res.locals.audience.departments.map(
				(departmentCode: string) =>
					jsonpath.value(organisations, `$..organisations[?(@.code=='${departmentCode}')]`).name
			)
			res.render('page/course/audience/configure-audience', {departmentsAsString})
		}
	}

	public getOrganisation() {
		return async (req: Request, res: Response) => {
			const organisations = await this.csrsService.getOrganisations()
			res.render('page/course/audience/add-organisation', {organisations})
		}
	}

	public setOrganisation() {
		return async (req: Request, res: Response) => {
			const organisations = await this.csrsService.getOrganisations()
			const selectedOrganisations = this.mapSelectedOrganisationToCodes(
				req.body.organisation,
				req.body['input-autocomplete'],
				organisations
			)
			if (selectedOrganisations.length > 0) {
				jsonpath.value(
					res.locals.course,
					`$..audiences[?(@.id=='${req.params.audienceId}')].departments`,
					selectedOrganisations
				)
				await this.learningCatalogue.updateCourse(res.locals.course)
			}
			res.redirect(
				`/content-management/courses/${req.params.courseId}/audiences/${req.params.audienceId}/configure`
			)
		}
	}

	private mapSelectedOrganisationToCodes(
		organisation: string,
		organisationName: string,
		organisations: any
	): string[] {
		return organisations._embedded.organisations
			.filter((org: any) => {
				return organisation === 'all' || org.name === organisationName
			})
			.map((org: any) => {
				return org.code
			})
	}

	public deleteAudienceConfirmation() {
		return async (req: Request, res: Response) => {
			res.render('page/course/audience/delete-audience-confirmation')
		}
	}

	public deleteAudience() {
		return async (req: Request, res: Response) => {
			await this.learningCatalogue.deleteAudience(req.params.courseId, req.params.audienceId)
			res.redirect(`/content-management/courses/${req.params.courseId}/overview`)
		}
	}

	public getAreasOfWork() {
		return async (request: Request, response: Response) => {
			const areasOfWork = await this.csrsService.getAreasOfWork()

			response.render('page/course/audience/add-area-of-work', {areasOfWork})
		}
	}

	public setAreasOfWork() {
		return async (request: Request, response: Response) => {
			response.render('page/course/audience/configure-audience')
		}
	}
}
