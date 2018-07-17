import {Audience} from './audience'
import {Event} from './event'

export class Module {
	private _id: string
	private _type: string
	private _title: string
	private _description: string
	private _duration: number
	private _url?: string
	private _fileSize?: number
	private _parsedFileSize?: string
	private _location?: string
	private _price?: number
	private _productCode?: string
	private _startPage?: string
	private _audiences: Audience[]
	private _events: Event[]

	get id(): string {
		return this._id
	}

	set id(value: string) {
		this._id = value
	}

	get type(): string {
		return this._type
	}

	set type(value: string) {
		this._type = value
	}

	get title(): string {
		return this._title
	}

	set title(value: string) {
		this._title = value
	}

	get description(): string {
		return this._description
	}

	set description(value: string) {
		this._description = value
	}

	get duration(): number {
		return this._duration
	}

	set duration(value: number) {
		this._duration = value
	}

	get url(): string | undefined {
		return this._url
	}

	set url(value: string | undefined) {
		this._url = value
	}

	get fileSize(): number | undefined {
		return this._fileSize
	}

	set fileSize(value: number | undefined) {
		this._fileSize = value
	}

	get parsedFileSize(): string | undefined {
		return this._parsedFileSize
	}

	set parsedFileSize(value: string | undefined) {
		this._parsedFileSize = value
	}

	get location(): string | undefined {
		return this._location
	}

	set location(value: string | undefined) {
		this._location = value
	}

	get price(): number | undefined {
		return this._price
	}

	set price(value: number | undefined) {
		this._price = value
	}

	get productCode(): string | undefined {
		return this._productCode
	}

	set productCode(value: string | undefined) {
		this._productCode = value
	}

	get startPage(): string | undefined {
		return this._startPage
	}

	set startPage(value: string | undefined) {
		this._startPage = value
	}

	get audiences(): Audience[] {
		return this._audiences
	}

	set audiences(value: Audience[]) {
		this._audiences = value
	}

	get events(): Event[] {
		return this._events
	}

	set events(value: Event[]) {
		this._events = value
	}
}
