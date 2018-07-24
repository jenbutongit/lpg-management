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
				console.log("expectation created");
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