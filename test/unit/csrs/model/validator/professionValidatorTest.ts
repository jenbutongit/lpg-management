import {Profession} from '../../../../../src/csrs/model/profession'
import {Validator} from '../../../../../src/learning-catalogue/validator/validator'
import {expect} from 'chai'
import {ProfessionFactory} from '../../../../../src/csrs/model/factory/professionFactory'

describe('Profession Validator tests', () => {
	const factory = new ProfessionFactory()
	const validator = new Validator<Profession>(factory)

	describe('validate name', () => {
		it('should not validate if name is missing partial validation', async () => {
			const errors = await validator.check(<Profession>{}, ['name'])
			expect(errors.size).to.equal(1)
			expect(errors.fields).to.eql({name: ['professions.validation.name.empty']})
		})

		it('should validate if name is present', async () => {
			const errors = await validator.check(<Profession>{
				name: 'profession'
			}, ['name'])
			expect(errors.size).to.equal(0)
		})

		it('should not validate if name is missing validating all fields', async () => {
			const errors = await validator.check(<Profession>{}, ['all'])
			expect(errors.size).to.equal(1)
			expect(errors.fields).to.eql({name: ['professions.validation.name.empty']})
		})

		it('should validate if name is present', async () => {
			const errors = await validator.check(<Profession>{
				name: 'profession'
			}, ['all'])
			expect(errors.size).to.equal(0)
		})
	})
})