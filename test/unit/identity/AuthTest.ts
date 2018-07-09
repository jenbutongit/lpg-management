import {describe, it} from 'mocha'
import {mockReq, mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import {NextFunction, Request, Response} from 'express'
import {Auth} from "../../../src/identity/auth"

chai.use(sinonChai)

describe('Auth tests', function () {

	let auth: Auth

	beforeEach(() => {
		auth = new Auth('clientId',
			'secret',
			'localhost:8080',
			'http://localhost:3030')
		//
		// sinon.stub(auth, 'authenticate').callsFake(function (req, res, next) {
		// 	console.log('stubbing isAuth')
		// 	return next()
		// })
	})

	it('should return next function if user is authenticated', function () {
		// const index: (request: Request, response: Response) => void = homeController.index()
		// const request: Request = mockReq()
		// const reponse: Response = mockRes()
		//
		// index(request, reponse)
		//
		// expect(reponse.render).to.have.been.calledOnceWith('index')

		const authenticate: (request: Request, response: Response, next: NextFunction) => void = auth.authenticate
		const request: Request = mockReq()
		const reponse: Response = mockRes()
		const next: NextFunction = function () {
			console.log('next was called');
		};

		sinon.stub(request, 'isAuthenticated').returns(true)

		authenticate(request, reponse, next)
	});

});

// 'f90a4080-e5e9-4a80-ace4-f738b4c9c30e',
// 	'test',
// 	'http://localhost:8080',
// 	app,
// 	'http://localhost:3030'