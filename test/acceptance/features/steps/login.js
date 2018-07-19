const {Given, When, Then} = require('cucumber');
const axios = require('axios');
const {expect} = require('chai');
const mockServerClient = require('mockserver-client').mockServerClient;
const fs = require('fs')

const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const tough = require('tough-cookie');

const {MockIdentityService} = require('./lib/mock-identity-service')
const {MockLearningCatalogue} = require('./lib/mock-learning-catalogue')

axiosCookieJarSupport.default(axios);

const cookieJar = new tough.CookieJar();

const http = axios.create({
    baseURL: 'http://lpg.local.cshr.digital:3005',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 6000000,
})

let promise;

Given(/^I am not authenticated$/, () => {
});

When(/^I request the home page$/, () => {
	const learningCatalogue = new MockLearningCatalogue('localhost', 9001)
	learningCatalogue.stubCoursesEndpoint()

	promise = http.get('/', {
		jar: cookieJar,
		withCredentials: true
	})
});

Then(/^I am redirected to the login page$/, (callback) => {
    promise.then(function (response) {
        expect(response.status).to.eql(302);
    }).catch((error) => {
        callback(error);
    });
});

Given(/^I am an authenticated user$/, () => {
	const identityService = new MockIdentityService('identity.local.cshr.digital', 8080)

	identityService.stubLoginJourney()
})

Then(/^I see a paginated list of all courses$/, (callback) => {
	promise.then(function (response) {
		expect(response.status).to.eql(200);
	}).catch((error) => {
		callback(error);
	}).finally((callback) => {
		mockServerClient("localhost", 8080)
			.reset()
			.then(
				function () {
					console.log("reset all state");
				},
				function (error) {
					console.log(error);
				}
			);
	})
});