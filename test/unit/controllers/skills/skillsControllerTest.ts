import {beforeEach, describe, it} from 'mocha'
import {CsrsService} from '../../../../src/csrs/service/csrsService'
import {NextFunction, Request, Response} from 'express'
import * as sinon from 'sinon'
import {mockReq, mockRes} from 'sinon-express-mock'
import {SkillsController} from '../../../../src/controllers/skills/skillsController'
import {expect} from 'chai'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {QuestionFactory} from '../../../../src/controllers/skills/questionFactory'

chai.use(sinonChai)

describe('Skills Controller Tests', function() {
	let skillsController: SkillsController
	let csrsService: CsrsService
	let questionFactory: QuestionFactory
	let req: Request
	let res: Response
	const next: NextFunction = sinon.stub()

	beforeEach(() => {
		csrsService = <CsrsService>{}
		questionFactory = <QuestionFactory>{}

		skillsController = new SkillsController(csrsService, questionFactory)

		req = mockReq()
		res = mockRes()
		req.session!.save = callback => {
			callback(undefined)
		}
	})

	describe('Skills Manage', () => {
		it('should render skills page', async () => {
			await skillsController.getSkills()(req, res, next)
			expect(res.render).to.have.been.calledOnceWith('page/skills/skills')
		})
	})

	describe('Add new question', () => {
		it('should render Add new question page', async () => {
			await skillsController.getAddQuestion()(req, res, next)
			expect(res.render).to.have.been.calledOnceWith('page/skills/add-new-question')
		})
	})

	describe('Skills report', () => {
		it('should render Skills report page', async () => {
			await skillsController.getSkillsReport()(req, res, next)
			expect(res.render).to.have.been.calledOnceWith('page/skills/generate-report')
		})
	})
})
