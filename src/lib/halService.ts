import {CsrsConfig} from "../csrs/csrsConfig"
import {createClient, HalResource} from "hal-rest-client";

export class HalService {

	private config: CsrsConfig
	private client: any

	constructor(config: CsrsConfig) {
		this.config = config

		this.client = createClient(this.config.url);
	}

	async getResource(uri: String) {
		return await this.client.fetchResource(uri);
	}

	async getLink(resource: HalResource, link: string) {
		const linkValue = resource.link(link);
		return await linkValue.fetch().catch(function(error) {
			console.log(error);
		});
	}
}