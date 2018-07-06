var {Given, When, Then, defineSupportCode} = require('cucumber');
var axios = require('axios')
var appRoot = require('app-root-path');
var {expect, fail} = require('chai')
var nock = require('nock');

const http = axios.create({
    baseURL: 'http://localhost',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
})

let promise;

Given(/^I am not authenticated$/, function () {
});

When(/^I request the home page$/, function (callback) {
    promise = http.get('/home').catch(function (error) {
        if (error.response) {
            console.log(error.response.status);
        } else {
            callback.fail
            console.log('Error', error.message);
        };
});
});

Then(/^I am redirected to the login page$/, function (callback) {
    promise.then(function (response) {
        expect(response.status).to.eql(302);
    }, error => {
        console.log("new error")
        callback.fail
    })
});