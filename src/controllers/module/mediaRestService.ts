import {JsonRestService} from '../../lib/http/jsonRestService'

export class MediaRestService extends JsonRestService {
	protected getHeaders() {
		return {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.auth.currentUser.accessToken}`,
			},
		}
	}
}
