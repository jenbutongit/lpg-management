import {LearnerRecord} from '../../../src/leaner-record'
import {LearnerRecordConfig} from '../../../src/leaner-record/learnerRecordConfig'
import {beforeEach} from 'mocha'
import {Auth} from '../../../src/identity/auth'
import * as sinonChai from 'sinon-chai'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {OauthRestService} from 'lib/http/oauthRestService'
import {BookingFactory} from '../../../src/leaner-record/model/factory/BookingFactory'

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('Leaner Record Tests', () => {
	let learnerRecord: LearnerRecord
	let bookingFactory: BookingFactory
	let restService: OauthRestService

	const config = new LearnerRecordConfig('http://example.org')

	beforeEach(() => {
		bookingFactory = <BookingFactory>{}
		restService = <OauthRestService>{}

		learnerRecord = new LearnerRecord(config, {} as Auth, bookingFactory)
		learnerRecord.restService = restService
	})
})
