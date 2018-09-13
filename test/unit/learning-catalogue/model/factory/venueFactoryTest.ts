import {describe, it} from 'mocha'
import {expect} from 'chai'
import {VenueFactory} from '../../../../../src/learning-catalogue/model/factory/venueFactory'

describe('VenueFactory', function() {
	describe('#create', function() {
		it('should return empty object if invoked with undefined data', function() {
			const venue = new VenueFactory().create(undefined)
			expect(venue).to.deep.equal({})
		})
	})
})
