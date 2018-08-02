import * as url from 'url'
import {AxiosInstance, AxiosResponse} from 'axios'
import {LearningCatalogueConfig} from '../learningCatalogueConfig'

export class RestService {
	http: AxiosInstance
	config: LearningCatalogueConfig

	constructor(http: AxiosInstance, config: LearningCatalogueConfig) {
		this.http = http
		this.config = config

		http.defaults.baseURL = config.url
		http.defaults.auth = config.auth

		this.post = this.post.bind(this)
		this.get = this.get.bind(this)
	}

	async post(path: string, resource: any) {
		try {
			const response: AxiosResponse = await this.http.post(path, resource)

			return this.get(url.parse(response.headers.location).path!)
		} catch (e) {
			throw new Error(
				`Error with POST request: ${e} when posting ${JSON.stringify(
					resource
				)} to ${this.config.url}${path} `
			)
		}
	}

	async get(path: string) {
		try {
			return (await this.http.get(path)).data
		} catch (e) {
			throw new Error(
				`Error with GET request: ${e} when getting ${
					this.config.url
				}${path}`
			)
		}
	}
}
