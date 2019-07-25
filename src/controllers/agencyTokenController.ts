import { NextFunction, Request, Response, Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import * as log4js from 'log4js'
import { AgencyToken } from '../csrs/model/agencyToken'
import { AgencyTokenService } from '../lib/agencyTokenService'
import { FormController } from './formController'
import { OrganisationalUnit } from '../csrs/model/organisationalUnit'
import { OrganisationalUnitService } from '../csrs/service/organisationalUnitService'
import { Validator } from '../learning-catalogue/validator/validator'
import { Validate } from './formValidator'
import { AgencyTokenFactory } from '../csrs/model/agencyTokenFactory';
import { Csrs } from '../csrs';

const logger = log4js.getLogger('controllers/AgencyTokenController')

export class AgencyTokenController implements FormController {
	router: Router
	validator: Validator<AgencyToken>
	agencyTokenService: AgencyTokenService
	organisationalUnitService: OrganisationalUnitService
	agencyTokenFactory: AgencyTokenFactory
	csrs: Csrs
	
	constructor(validator: Validator<AgencyToken>, agencyTokenService: AgencyTokenService, organisationalUnitService: OrganisationalUnitService, agencyTokenFactory: AgencyTokenFactory, 
			csrs: Csrs) {
		this.router = Router()
		this.validator = validator
		this.agencyTokenService = agencyTokenService
		this.organisationalUnitService = organisationalUnitService
		this.agencyTokenFactory = agencyTokenFactory
		this.csrs = csrs

		this.getOrganisationFromRouterParamAndSetOnLocals()
		this.setRouterPaths()
	}

	/* istanbul ignore next */
	// prettier-ignore
	private getOrganisationFromRouterParamAndSetOnLocals() {
		this.router.param('organisationalUnitId', asyncHandler(async (req: Request, res: Response, next: NextFunction, organisationalUnitId: string) => {
				const organisationalUnit: OrganisationalUnit = await this.organisationalUnitService.getOrganisationalUnit(organisationalUnitId)

				if (organisationalUnit) {
					res.locals.organisationalUnit = organisationalUnit
					next()
				} else {
					res.sendStatus(404)
				}
			})
		)
	}

	/* istanbul ignore next */
	private setRouterPaths() {
		this.router.get('/content-management/organisations/:organisationalUnitId/agency-token', asyncHandler(this.addEditAgencyToken()))
		this.router.post('/content-management/organisations/:organisationalUnitId/agency-token', asyncHandler(this.createAgencyToken()))
		this.router.get('/content-management/organisations/:organisationalUnitId/agency-token/delete', asyncHandler(this.deleteAgencyTokenConfirmation()))
		this.router.post('/content-management/organisations/:organisationalUnitId/agency-token/delete', asyncHandler(this.deleteAgencyToken()))
		this.router.post('/content-management/organisations/:organisationalUnitId/agency-token/domain', asyncHandler(this.addDomainToAgencyTokenWithinSession()))
		this.router.post('/content-management/organisations/:organisationalUnitId/agency-token/domain/delete', asyncHandler(this.deleteDomainFromAgencyTokenWithinSession()))
	}

	public addEditAgencyToken() {
		return async (request: Request, response: Response) => {
			const organisationalUnit: OrganisationalUnit = response.locals.organisationalUnit

			if (!request.session!.agencyTokenNumber) {
				if (organisationalUnit.agencyToken) {
					request.session!.agencyTokenNumber = organisationalUnit.agencyToken.token
				} else {
					request.session!.agencyTokenNumber = this.agencyTokenService.generateToken()
				}
			}
			const agencyTokenNumber = request.session!.agencyTokenNumber

			// list the token's domains if editing and no provisional (session-local) changes to these domains have been made yet
			if (organisationalUnit.agencyToken && !request.session!.domainsForAgencyToken) {
				request.session!.domainsForAgencyToken = organisationalUnit.agencyToken.agencyDomains.map((agencyDomain) => { return agencyDomain.domain })
			}

			const domainsForAgencyToken = request.session!.domainsForAgencyToken

			request.session!.save(() => {
				response.render('page/organisation/add-edit-agency-token', { organisationalUnit: organisationalUnit, 
					agencyTokenNumber: agencyTokenNumber,
					domainsForAgencyToken: domainsForAgencyToken
				})
			})
		}
	}

	public addDomainToAgencyTokenWithinSession() {
		return async (request: Request, response: Response) => {
			const organisationalUnit: OrganisationalUnit = response.locals.organisationalUnit
			const domainToAdd = request.body.domainToAdd

			const domainIsValid = this.agencyTokenService.validateDomains([domainToAdd])
			if (!domainIsValid) {
				const errors = {fields: {domains: ['agencyToken.validation.domains.invalidFormat']}, size: 1}
				request.session!.sessionFlash = { errors: errors }
				console.log('SessionFlash.errors = ' + JSON.stringify(errors, null, 2))

				return request.session!.save(() => {
					response.redirect(`/content-management/organisations/${organisationalUnit.id}/agency-token`)
				})
			}

			if (request.session!.domainsForAgencyToken == undefined) {
				request.session!.domainsForAgencyToken = []
			}

			request.session!.domainsForAgencyToken.push(domainToAdd)

			request.session!.save(() => {
				response.redirect(`/content-management/organisations/${organisationalUnit.id}/agency-token`)
			})
		}
	}

	public deleteDomainFromAgencyTokenWithinSession() {
		return async (request: Request, response: Response) => {
			const organisationalUnit: OrganisationalUnit = response.locals.organisationalUnit
			const domainToDelete = request.body.domainToDelete

			request.session!.domainsForAgencyToken.forEach((domain: string, index: number) => {
				if (domain == domainToDelete) {
					request.session!.domainsForAgencyToken.splice(index, 1)
				}
			})

			request.session!.save(() => {
				response.redirect(`/content-management/organisations/${organisationalUnit.id}/agency-token`)
			})
		}
	}

	@Validate({
		fields: ['all'],
		redirect: '/content-management/organisations/:organisationalUnitId/agency-token',
	})
	public createAgencyToken() {
		return async (request: Request, response: Response) => {
			const organisationalUnit: OrganisationalUnit = response.locals.organisationalUnit

			logger.debug(`Adding agency token to organisation: ${organisationalUnit.name}`)

			const capacityIsValid = this.agencyTokenService.validateCapacity(request.body.capacity)
			if (!capacityIsValid) {
				const errors = {fields: {capacity: ['agencyToken.validation.capacity.invalid']}, size: 1}
				request.session!.sessionFlash = { errors: errors }

				return request.session!.save(() => {
					response.redirect(`/content-management/organisations/${organisationalUnit.id}/agency-token`)
				})
			}

			const domainsIsValid = this.agencyTokenService.validateDomains(request.session!.domainsForAgencyToken)
			if (!domainsIsValid) {
				let errors = {}
				if (!(Array.isArray(request.session!.domainsForAgencyToken) && request.session!.domainsForAgencyToken.length)) {
					errors = {fields: {domains: ['agencyToken.validation.domains.empty']}, size: 1}
				} else {
					errors = {fields: {domains: ['agencyToken.validation.domains.invalid']}, size: 1}
				}
				request.session!.sessionFlash = { errors: errors }

				return request.session!.save(() => {
					response.redirect(`/content-management/organisations/${organisationalUnit.id}/agency-token`)
				})
			}

			console.log(`\n\nSetting agency token for: ${organisationalUnit.name}\n----------------------------------------`)
			console.log('tokenNumber = ' + request.body.tokenNumber)
			console.log('capacity = ' + request.body.capacity)
			console.log('domains = ' + request.session!.domainsForAgencyToken + '\n\n')

			const data = {
				...request.body,
				domains: request.session!.domains
			 }
			const agencyToken: AgencyToken = this.agencyTokenFactory.create(data)

			organisationalUnit.agencyToken = agencyToken

			await this.csrs.updateOrganisationalUnit(organisationalUnit.id, organisationalUnit)

			// include try/catch for 'token number already exists' case

			this.deleteAgencyTokenDataStoredInSession(request)

			response.redirect(`/content-management/organisations/${organisationalUnit.id}/overview`)
		}
	}

	public deleteAgencyTokenConfirmation() {
		return async (request: Request, response: Response) => {
			response.render('page/organisation/delete-agency-token')
		}
	}

	public deleteAgencyToken() {
		return async (request: Request, response: Response) => {
			const organisationalUnit = response.locals.organisationalUnit

			logger.debug(`Deleting agency token from organisation: ${organisationalUnit.name}`)

			// CSRS 'delete agency token' call here

			request.session!.sessionFlash = { displayAgencyTokenRemovedMessage: true, organisationalUnit: organisationalUnit }

			response.redirect(`/content-management/organisations/${organisationalUnit.id}/overview`)
		}
	}

	private deleteAgencyTokenDataStoredInSession(request: any) {
		if (request.session!.domainsForAgencyToken) {
			delete request.session!.domainsForAgencyToken
		}
		if (request.session!.agencyTokenNumber) {
			delete request.session!.agencyTokenNumber
		}
	}
}
