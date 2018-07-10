import {AxiosInstance} from 'axios'
import {Identity} from './identity'

export class IdentityService {
	http: AxiosInstance

	constructor(http: AxiosInstance) {
		this.http = http
	}

	async getDetails(token: string) {
		const response = await this.http.get(`/oauth/resolve`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		const identity = new Identity(response.data.uid, response.data.roles, token)

		return identity
	}
}
