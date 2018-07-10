import {AxiosInstance} from 'axios'

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
		return response.data
	}
}
