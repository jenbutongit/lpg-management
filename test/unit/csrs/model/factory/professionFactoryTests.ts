import {ProfessionFactory} from '../../../../../src/csrs/model/factory/professionFactory'
import {expect} from 'chai'
import {Profession} from '../../../../../src/csrs/model/profession'

describe('ProfessionFactory tests', () => {
	let factory: ProfessionFactory

	before(() => {
		factory = new ProfessionFactory()
	})

	it('should return a Profession', async () => {

		const parent = new Profession()
		parent.id = 98
		parent.name = 'parent-name'

		const data:any = {
			id: 99,
			name: 'profession',
			parent: {
				id: 98,
				name: 'parent-name'
			},
		}

		const result = await factory.create(data)

		expect(result.id).to.equal(99)
		expect(result.name).to.equal('profession')
		expect(result.parent).to.eql(parent)
	})
})