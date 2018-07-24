export class LpgConfig {
	private _lpgUiUrl: string

	constructor(lpgUiUrl: string) {
		this._lpgUiUrl = lpgUiUrl
	}

	get lpgUiUrl(): string {
		return this._lpgUiUrl
	}

	set lpgUiUrl(value: string) {
		this._lpgUiUrl = value
	}
}
