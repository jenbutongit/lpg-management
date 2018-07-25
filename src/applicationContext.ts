import * as config from './config'
import * as log4js from 'log4js'
import {HomeController} from './controllers/homeController'
import axios, {AxiosInstance} from 'axios'
import {IdentityService} from './identity/identityService'
import {Auth} from './identity/auth'
import * as passport from 'passport'
import {AuthConfig} from './identity/authConfig'

import {LearningCatalogueConfig} from './learning-catalogue/learningCatalogueConfig'
import {LearningCatalogue} from './learning-catalogue'
import {EnvValue} from 'ts-json-properties'

log4js.configure(config.LOGGING)

export class ApplicationContext {
	homeController: HomeController
	identityService: IdentityService
	axiosInstance: AxiosInstance
	auth: Auth
	learningCatalogueConfig: LearningCatalogueConfig
	learningCatalogue: LearningCatalogue
	@EnvValue('lpgUiUrl') private lpgUiUrl: String

	constructor() {
		this.axiosInstance = axios.create({
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: config.REQUEST_TIMEOUT,
		})

		this.identityService = new IdentityService(this.axiosInstance)

		this.auth = new Auth(
			new AuthConfig(
				config.AUTHENTICATION.clientId,
				config.AUTHENTICATION.clientSecret,
				config.AUTHENTICATION.authenticationServiceUrl,
				config.AUTHENTICATION.callbackUrl,
				config.AUTHENTICATION_PATH
			),
			passport,
			this.identityService
		)
		this.learningCatalogueConfig = new LearningCatalogueConfig(
			config.COURSE_CATALOGUE.auth.username,
			config.COURSE_CATALOGUE.auth.password,
			config.COURSE_CATALOGUE.url
		)

		this.learningCatalogue = new LearningCatalogue(
			this.axiosInstance,
			this.learningCatalogueConfig
		)

		this.homeController = new HomeController(
			this.learningCatalogue,
			this.lpgUiUrl
		)
	}
}
