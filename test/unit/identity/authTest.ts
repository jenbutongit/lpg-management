import {describe, it} from 'mocha'
import {mockRes} from 'sinon-express-mock'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {NextFunction, Request, Response} from 'express'
import * as sinon from 'sinon'
import {expect} from 'chai'
import {PassportStatic} from 'passport'
import {IdentityService} from '../../../src/identity/identityService'
import {Auth} from '../../../src/identity/auth'
// import * as oauth2 from 'passport-oauth2'
import {Identity} from '../../../src/identity/identity'
// import {VerifyCallback} from 'passport-oauth2'

chai.use(sinonChai)

describe('Auth tests', function() {
	let auth: Auth
	let passportStatic: PassportStatic = <PassportStatic>{}
	let identityService: IdentityService = <IdentityService>{}

	beforeEach(() => {
		auth = new Auth(
			'clientId',
			'secret',
			'localhost:8080',
			'http://localhost:3030',
			passportStatic,
			identityService
		)
	})

	it('should return next function if user is authenticated', function() {
		const authenticate: (
			request: Request,
			response: Response,
			next: NextFunction
		) => void = auth.authenticate()

		const reponse: Response = mockRes()
		const request: Request = <Request>{}
		request.isAuthenticated = sinon.stub().returns(true)

		const next: NextFunction = sinon.stub()

		authenticate(request, reponse, next)

		expect(next).to.have.been.calledOnce
	})

	it('should return redirect if user is not authenticated', function() {
		const originalUrl = 'original-url'

		const authenticate: (
			request: Request,
			response: Response,
			next: NextFunction
		) => void = auth.authenticate()

		const response: Response = mockRes()
		const request: Request = <Request>{}
		const next: NextFunction = sinon.stub()

		request.isAuthenticated = sinon.stub().returns(false)
		request.originalUrl = originalUrl

		response.cookie = sinon.stub()
		response.redirect = sinon.stub()

		authenticate(request, response, next)

		expect(response.cookie).to.have.been.calledOnceWith(
			'redirectTo',
			originalUrl
		)
		expect(response.redirect).to.have.been.calledOnceWith('/authenticate')
	})

	it('should call passportStatic initialize', function() {
		passportStatic.initialize = sinon.stub()

		auth.initialize()

		expect(passportStatic.initialize).to.have.been.calledOnce
	})

	it('should call passportStatic session', function() {
		passportStatic.session = sinon.stub()

		auth.session()

		expect(passportStatic.session).to.have.been.calledOnce
	})

	it('should call Verify()', function() {
		const verifyCallback = auth.verify()

		const accessToken = 'access-token'
		const identity: Identity = <Identity>sinon.createStubInstance(Identity)
		const getDetails = sinon
			.stub()
			.withArgs(accessToken)
			.returns(identity)

		identityService.getDetails = getDetails
		const passportCallback = sinon.stub()

		verifyCallback(accessToken, 'refresh-token', null, passportCallback).then(
			function() {
				expect(passportCallback).to.have.been.calledOnceWith(null, identity)
			}
		)
	})

	it('verify should catch and log errors', function() {
		const verifyCallback = auth.verify()

		const accessToken = 'access-token'

		const error: Error = new Error('Test Error')

		const getDetails = sinon
			.stub()
			.withArgs(accessToken)
			.throws(error)

		identityService.getDetails = getDetails
		const passportCallback = sinon.stub()

		verifyCallback(accessToken, 'refresh-token', null, passportCallback).then(
			function() {
				expect(passportCallback).to.have.been.calledOnceWith(error)
			}
		)
	})

	it('serializeUser should call passport serializeUser()', function() {
		passportStatic.serializeUser = sinon.stub()

		const identity: Identity = <Identity> sinon.createStubInstance(Identity)

		auth.serializeUser(identity)

		expect(passportStatic.serializeUser).calledOnceWith(identity)
	})
})
