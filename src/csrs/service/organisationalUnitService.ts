import {OrganisationalUnitFactory} from '../model/organisationalUnitFactory'
import {Csrs} from '../index'
import * as log4js from 'log4js'

const logger = log4js.getLogger('csrs/service/OrganisationalUnitService')

export class OrganisationalUnitService {
	csrs: Csrs
	organisationalUnitFactory: OrganisationalUnitFactory

	constructor(csrs: Csrs, organisationalUnitFactory: OrganisationalUnitFactory) {
		this.csrs = csrs
		this.organisationalUnitFactory = organisationalUnitFactory
	}

	async getOrganisationalUnit(uri: string) {
		let organisationalUnit: any
		let parent: any

		organisationalUnit = await this.csrs.getOrganisationalUnit(uri).catch(error => {
			throw error
		})

		parent = await this.csrs.getOrganisationalUnit(`${organisationalUnit.id}/parent`).catch(error => {
			if (error.response.status == 404) {
				logger.debug(`Organisation ${organisationalUnit.id} has no parent`)
			} else {
				throw error
			}
		})

		const data = {
			id: organisationalUnit.id,
			name: organisationalUnit.name,
			code: organisationalUnit.code,
			abbreviation: organisationalUnit.abbreviation,
			parent: parent,
		}

		return this.organisationalUnitFactory.create(data)
	}
}
