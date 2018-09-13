import {describe, it} from 'mocha'
import {expect} from 'chai'
import {EventFactory} from '../../../../../src/learning-catalogue/model/factory/eventFactory'
import {Event} from '../../../../../src/learning-catalogue/model/event'

describe('EventFactory tests', () => {
	const eventFactory: EventFactory = new EventFactory()

	it('should create Event from data', () => {
		const id: string = 'LmYAPQseRqm7dk1Q2WjA2w'
		const dateRanges = [{date: '2018-01-01', startTime: '6:00:00', endTime: '9:00:00'}]
		const location: string = 'London'
		const address: string = 'SE1'
		const capacity: number = 100
		const minCapacity: number = 10

		const data: object = {
			id: id,
			dateRanges: dateRanges,
			venue: {
				location: location,
				address: address,
				capacity: capacity,
				minCapacity: minCapacity,
			},
		}
		const result: Event = eventFactory.create(data)

		expect(result.id).to.equal(id)
		expect(result.dateRanges).to.equal(dateRanges)
		expect(result.venue.location).to.equal(location)
		expect(result.venue.address).to.equal(address)
		expect(result.venue.capacity).to.equal(capacity)
		expect(result.venue.minCapacity).to.equal(minCapacity)
	})

	it('should ignore missing date', () => {
		const id: string = 'LmYAPQseRqm7dk1Q2WjA2w'
		const location: string = 'London'
		const address: string = 'SE1'
		const capacity: number = 100
		const minCapacity: number = 10

		const data: object = {
			id: id,
			date: null,
			venue: {
				location: location,
				address: address,
				capacity: capacity,
				minCapacity: minCapacity,
			},
		}

		const result: Event = eventFactory.create(data)

		expect(result.id).to.equal(id)
		expect(result.dateRanges).to.be.undefined
		expect(result.venue.location).to.equal(location)
		expect(result.venue.address).to.equal(address)
		expect(result.venue.capacity).to.equal(capacity)
		expect(result.venue.minCapacity).to.equal(minCapacity)
	})
})
