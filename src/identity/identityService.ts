import {AxiosInstance} from 'axios'
import {Identity} from './identity'
import * as config from '../config'

export class IdentityService {
	http: AxiosInstance

	constructor(http: AxiosInstance) {
		this.http = http
	}

	async getDetails(token: string) {
		const response = await this.http.get(`/oauth/resolve`, {
			baseURL: config.AUTHENTICATION.authenticationServiceUrl,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		//Setting empty userName because details returned above does not contains it.
		const identity = new Identity(response.data.uid, response.data.roles, token, '')

		return identity
	}

	async logout(token: string) {
		await this.http.get(`/oauth/logout`, {
			baseURL: config.AUTHENTICATION.authenticationServiceUrl,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	}
}
