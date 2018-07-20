const mockServer = require('mockserver-node')

const argv = require('minimist')(process.argv.slice(2));

const instructions = [
	'',
	'Start a mock server...',
	'	Example: server.js -p [port] -n [name]',
	'		-p: The port the mock service should run on',
	'		-n: (optional) The name of the service (only used for logging)',
	''].join('\n')

const actions = {
	start: (port, name) => {
		console.log(`starting ${name} mock service on port ${port}`)
		require('daemonize-process')()
		mockServer.start_mockserver({
			serverPort: port,
			verbose: true
		});
	},
	stop: (port, name) => {
		console.log(`stopping ${name} mock service on port ${port}`)
		mockServer.stop_mockserver({
			serverPort: 9001,
			verbose: true
		});
	}
}

const help = () => {
	console.log(instructions);
}

const exit = (message) => {
	console.log(`\nERROR: ${message}`)
	help();
	process.exit(1)
}

if (argv.h) {
	help()
}
else if (actions[argv._[0]]) {
	const port = argv.p || exit('Port is not defined')
	const name = argv.n || ''
	actions[argv._[0]](port, name)
}
else {
	console.log(`unknown command: ${argv._[0]}`)
}
