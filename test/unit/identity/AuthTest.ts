import {describe, it} from 'mocha'
import {mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {NextFunction, Request, Response} from 'express'
import {Auth} from "../../../src/identity/auth"
import * as sinon from 'sinon'
import {expect} from 'chai'

chai.use(sinonChai)

describe('Auth tests', function () {

	let auth: Auth

	beforeEach(() => {
		auth = new Auth('clientId',
			'secret',
			'localhost:8080',
			'http://localhost:3030')
	})

	it('should return next function if user is authenticated', function () {
		const authenticate: (request: Request, response: Response, next: NextFunction) => void = auth.authenticate()

		const reponse: Response = mockRes()
		const request: Request = <Request>{}
		request.isAuthenticated = sinon.stub().returns(true)

		const next: NextFunction = sinon.stub()

		authenticate(request, reponse, next)

		expect(next).to.have.been.calledOnce
	});

});

// 'f90a4080-e5e9-4a80-ace4-f738b4c9c30e',
// 	'test',
// 	'http://localhost:8080',
// 	app,
// 	'http://localhost:3030'