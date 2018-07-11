import * as config from './config'
import * as log4js from 'log4js'
import {HomeController} from './controllers/home'
import axios, {AxiosInstance} from 'axios'
import {IdentityService} from './identity/identityService'
import {Auth} from './identity/auth'
import * as passport from 'passport'

log4js.configure(config.LOGGING)

export class ApplicationContext {
	public homeController: HomeController
	public identityService: IdentityService
	public axiosInstance: AxiosInstance
	public auth: Auth

	constructor() {
		this.homeController = new HomeController()

		this.axiosInstance = axios.create({
			baseURL: config.AUTHENTICATION.authenticationServiceUrl,
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: config.REQUEST_TIMEOUT,
		})

		this.identityService = new IdentityService(this.axiosInstance)

		this.auth = new Auth(
			config.AUTHENTICATION.managementClientId,
			config.AUTHENTICATION.managementClientSecret,
			config.AUTHENTICATION.authenticationServiceUrl,
			config.AUTHENTICATION.callbackUrl,
			passport,
			this.identityService
		)
	}
}

export default new ApplicationContext()
