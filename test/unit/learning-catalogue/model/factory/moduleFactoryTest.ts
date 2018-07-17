import {Module} from '../../../../../src/learning-catalogue/model/module'
import {EventFactory} from '../../../../../src/learning-catalogue/model/factory/eventFactory'
import {AudienceFactory} from '../../../../../src/learning-catalogue/model/factory/audienceFactory'
import {ModuleFactory} from '../../../../../src/learning-catalogue/model/factory/moduleFactory'
import {beforeEach} from 'mocha'
import {expect} from 'chai'

describe('ModuleFactory tests', () => {
	let eventFactory: EventFactory
	let audienceFactory: AudienceFactory
	let moduleFactory: ModuleFactory

	beforeEach(() => {
		// eventFactory = <EventFactory>{}
		// audienceFactory = <AudienceFactory>{}

		eventFactory = new EventFactory()
		audienceFactory = new AudienceFactory()

		moduleFactory = new ModuleFactory(audienceFactory, eventFactory)
	})

	it('should create module from data', () => {
		const type: string = 'face-to-face'
		const productCode: string = 'F13'
		const id: string = 'MBlZJv-ZRDCYZsCByjzRuQ'
		const title: string = 'module title'
		const description: string = 'module description'
		const duration: number = 3600
		const price: number = 100
		const eventId: string = 'XEbjXzmVQwSQ_7qIvr7Kew'
		const eventCapacity: number = 99
		const eventLocation: string = 'London'
		const eventDate: string = '2018-05-24T00:00:00'
		const audienceAreasOfWork: string[] = ['digital']
		const audienceDepartments: string[] = ['co', 'hmrc']
		const audienceGrades: string[] = ['AA', 'G7']
		const audienceInterests: string[] = ['project management']
		const audienceRequiredBy: string = '2019-01-01T00:00:00'
		const audienceFrequency: string = 'YEARLY'
		const audienceMandatory: boolean = true

		const data: object = {
			type: type,
			productCode: productCode,
			id: id,
			title: title,
			description: description,
			duration: duration,
			price: price,
			events: [
				{
					id: eventId,
					capacity: eventCapacity,
					location: eventLocation,
					date: eventDate,
				},
			],
			audiences: [
				{
					areasOfWork: audienceAreasOfWork,
					departments: audienceDepartments,
					grades: audienceGrades,
					interests: audienceInterests,
					requiredBy: audienceRequiredBy,
					frequency: audienceFrequency,
					mandatory: audienceMandatory,
				},
			],
		}

		const result: Module = moduleFactory.create(data)

		expect(result.id).to.equal(id)
		expect(result.type).to.equal(type)
		expect(result.productCode).to.equal(productCode)
		expect(result.title).to.equal(title)
		expect(result.description).to.equal(description)
		expect(result.duration).to.equal(duration)
		expect(result.price).to.equal(price)

		expect(result.events[0].id).to.equal(eventId)
		expect(result.events[0].capacity).to.equal(eventCapacity)
		expect(result.events[0].location).to.equal(eventLocation)
		expect(result.events[0].date.toISOString().substr(0, 19)).to.equal(
			eventDate
		)

		expect(result.audiences[0].areasOfWork).to.equal(audienceAreasOfWork)
		expect(result.audiences[0].departments).to.equal(audienceDepartments)
		expect(result.audiences[0].grades).to.equal(audienceGrades)
		expect(result.audiences[0].interests).to.equal(audienceInterests)
		expect(
			result.audiences[0].requiredBy!.toISOString().substr(0, 19)
		).to.equal(audienceRequiredBy)
		expect(result.audiences[0].frequency).to.equal(audienceFrequency)
		expect(result.audiences[0].mandatory).to.equal(audienceMandatory)
	})
})
