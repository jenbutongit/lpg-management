import {Venue} from '../venue'

export class VenueFactory {
	create(data: any) {
		const venue: Venue = new Venue()
		if (!Object.is(data, undefined) && !Object.is(data, null)) {
			venue.location = data.location
			venue.address = data.address
			venue.capacity = data.capacity
			venue.minCapacity = data.minCapacity
		}
		return venue
	}
}
