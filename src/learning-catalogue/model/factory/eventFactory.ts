import {Event} from '../event'
import {VenueFactory} from "./venueFactory";

export class EventFactory {
	venueFactory: VenueFactory;

	constructor(venueFactory: VenueFactory = new VenueFactory()) {
		this.venueFactory = venueFactory
		this.create = this.create.bind(this)
	}

	public create(data: any): any {
		const event: Event = new Event()

		event.id = data.id

		event.dateRanges = data.dateRanges

		event.venue = this.venueFactory.create(data.venue);

		return event
	}
}
