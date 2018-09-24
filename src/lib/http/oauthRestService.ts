import {RestService} from "./restService"

export class OauthRestService extends RestService{

	protected setHeaders(){
		return {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.auth.currentUser.accessToken}`,
			},
		}
	}
}