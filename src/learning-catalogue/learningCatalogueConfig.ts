export class LearningCatalogueConfig {
	private _auth: {
		username: string
		password: string
	}
	private _url: string

	constructor(auth: {username: string; password: string}, url: string) {
		this._auth = auth
		this._url = url
	}

	get auth(): {username: string; password: string} {
		return this._auth
	}

	set auth(value: {username: string; password: string}) {
		this._auth = value
	}

	get url(): string {
		return this._url
	}

	set url(value: string) {
		this._url = value
	}
}
