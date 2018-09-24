import {RestService} from '../lib/http/restService'

export class YoutubeRestService extends RestService {
	protected setHeaders() {
		return {
			headers: {
				'Content-Type': 'application/json',
			},
		}
	}
}
