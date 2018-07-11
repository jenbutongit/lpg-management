import {HomeController} from './controllers/home'
import axios, {AxiosInstance} from 'axios'
import {IdentityService} from './identity/identityService'
import {Auth} from './identity/auth'
import * as passport from 'passport'

export class ApplicationContext {
	public homeController: HomeController
	public identityService: IdentityService
	public axiosInstance: AxiosInstance
	public auth: Auth

	constructor() {
		this.homeController = new HomeController()

		this.axiosInstance = axios.create({
			baseURL: 'http://localhost:8080',
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: 15000,
		})

		this.identityService = new IdentityService(this.axiosInstance)

		this.auth = new Auth(
			'f90a4080-e5e9-4a80-ace4-f738b4c9c30e',
			'test',
			'http://localhost:8080',
			'http://localhost:3030',
			passport,
			this.identityService
		)
	}
}

export default new ApplicationContext()
