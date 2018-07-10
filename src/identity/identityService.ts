import {AxiosInstance} from 'axios'

export class IdentityService {
	http: AxiosInstance

	// constructor(baseUrl: string) {
	// 	const http = axios.create({
	// 		baseURL: this.baseUrl,
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		timeout: 5000,
	// 	})
	// }

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
