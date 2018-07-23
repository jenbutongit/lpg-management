const appRootPath = require('app-root-path')
const mockServerClient = require('mockserver-client').mockServerClient;
const fs = require('fs')

function MockLearningCatalogue(host, port) {
		this.mock = mockServerClient(host, port)

	this.stubCoursesEndpoint = function() {
		const learningCataloguePage1 =
			fs.readFileSync(
				`${appRootPath.path}/test/acceptance/features/steps/lib/mock-learning-catalogue/fixtures/courses.page.1.json`,
				'utf8'
			)

		this.mock.mockAnyResponse({
			httpRequest: 	{
				method: 'GET',
				path: '/courses',
			},
			httpResponse: {
				statusCode: 200,
				body: learningCataloguePage1,
			}
		}).then(
			function () {
				console.log("stubbed GET /courses endpoint in Learning Catalogue");
			},
			function (error) {
				console.log(error);
			}
		);
	}

	this.stubGetCourseEndpoint = function() {
			const course =
				fs.readFileSync(
					`${appRootPath.path}/test/acceptance/features/steps/lib/mock-learning-catalogue/fixtures/course.L1U3cK3GQtuf3iDg71NqJw.json`,
					'utf8'
				)

		this.mock.mockAnyResponse({
			httpRequest: 	{
				method: 'GET',
				path: '/courses/L1U3cK3GQtuf3iDg71NqJw',
			},
			httpResponse: {
				statusCode: 200,
				body: course,
			}
		}).then(
			function () {
				console.log("stubbed GET /courses/L1U3cK3GQtuf3iDg71NqJw endpoint in Learning Catalogue");
			},
			function (error) {
				console.log(error);
			}
		);
	}

	this.stubPostCourseEndpoint = function() {
		this.mock.mockAnyResponse({
			httpRequest: 	{
				method: 'POST',
				path: '/courses/',
			},
			httpResponse: {
				statusCode: 201,
				headers: [{
					name: 'Location',
					values : [ `http://${host}:${port}/courses/L1U3cK3GQtuf3iDg71NqJw in Learning Catalogue` ]
				}]
			}
		}).then(
			function () {
				console.log("stubbed POST /courses/ endpoint in Learning Catalogue");
			},
			function (error) {
				console.log(error);
			}
		);
	}

	this.reset = function() {
		this.mock.reset()
			.then(
				function () {
					console.log("reset all state for mock learning catalogue");
				},
				function (error) {
					console.log(error);
				}
			);
	}
}

module.exports.MockLearningCatalogue = MockLearningCatalogue