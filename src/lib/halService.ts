import {HalResource, HalRestClient} from "hal-rest-client";

export class HalService {

	private client: any

	constructor(client: HalRestClient) {
		this.client = client;
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