import * as config from './config'
import * as log4js from 'log4js'
import {HomeController} from './controllers/home'
import axios, {AxiosInstance} from 'axios'
import {IdentityService} from './identity/identityService'
import {Auth} from './identity/auth'
import * as passport from 'passport'
import {AuthConfig} from './identity/authConfig'

log4js.configure(config.LOGGING)

export class ApplicationContext {
	public homeController: HomeController
	public identityService: IdentityService
	public axiosInstance: AxiosInstance
	public auth: Auth

	constructor() {
		this.homeController = new HomeController()

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
	}
}

export default new ApplicationContext()
