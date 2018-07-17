export class LearningCatalogueConfig {
	private _username: string
	private _password: string
	private _url: string

	constructor(username: string, password: string, url: string) {
		this._username = username
		this._password = password
		this._url = url
	}

	get username(): string {
		return this._username
	}

	set username(value: string) {
		this._username = value
	}

	get password(): string {
		return this._password
	}

	set password(value: string) {
		this._password = value
	}

	get url(): string {
		return this._url
	}

	set url(value: string) {
		this._url = value
	}
}
