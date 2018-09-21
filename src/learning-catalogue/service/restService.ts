import * as url from 'url'
import axios, {AxiosInstance, AxiosResponse} from 'axios'
import {LearningCatalogueConfig} from '../learningCatalogueConfig'
import { Auth } from '../../identity/auth';

export class RestService {
	private _http: AxiosInstance
	config: any
	auth: Auth

	constructor(config: any, auth: Auth) {
		this.auth = auth
		this._http = axios.create({
			baseURL: config.url,
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: config.timeout,
		})

		this.config = config
		this.post = this.post.bind(this)
		this.get = this.get.bind(this)
	}

	async post(path: string, resource: any) {
		try {
			const response: AxiosResponse = await this._http.post(path, resource, this.setAuthHeaders())

			return this.get(url.parse(response.headers.location).path!)
		} catch (e) {
			throw new Error(
				`Error with POST request: ${e} when posting ${JSON.stringify(resource)} to ${this.config.url}${path}`
			)
		}
	}

	async get(path: string) {
		try {
			return (await this._http.get(path, this.setAuthHeaders())).data
		} catch (e) {
			throw new Error(`Error with GET request: ${e} when getting ${this.config.url}${path}`)
		}
	}

	async put(path: string, resource: any) {
		try {
			return (await this._http.put(path, resource, this.setAuthHeaders())).data
		} catch (e) {
			throw new Error(
				`Error with PUT request: ${e} when putting ${JSON.stringify(resource)} to ${this.config.url}${path}`
			)
		}
	}

	async delete(path: string) {
		try {
			return await this._http.delete(path, this.setAuthHeaders())
		} catch (e) {
			throw new Error(`Error with DELETE request: ${e} when deleting ${this.config.url}${path}`)
		}
	}

	set http(value: AxiosInstance) {
		this._http = value
	}

	private setAuthHeaders() {
	if (this.config instanceof LearningCatalogueConfig)
		return {
			headers: {
				Authorization: `Bearer ${this.auth.currentUser.accessToken}`,
			},
		}
	}
}
