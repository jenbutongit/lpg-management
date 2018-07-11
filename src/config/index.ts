export const ENV = process.env.NODE_ENV || 'development'

function getEnv(obj: any, attr: string) {
	return process.env[attr] || ''
}

function set<T>(defaultValue: T, envValues: Record<string, T> = {}): T {
	const val = envValues[ENV]
	if (val === undefined) {
		return defaultValue
	}
	return val
}

const env: Record<string, string> = new Proxy({}, {get: getEnv})

export const LOGGING = set(
	{
		appenders: {
			out: {type: 'console'},
		},
		categories: {
			default: {appenders: ['out'], level: 'info'},
		},
	},
	{
		development: {
			appenders: {
				out: {type: 'console'},
			},
			categories: {
				default: {appenders: ['out'], level: 'debug'},
			},
		},
	}
)

export const AUTHENTICATION = set({
	managementClientId:
		env.OAUTH_CLIENT_ID || 'f90a4080-e5e9-4a80-ace4-f738b4c9c30e',
	managementClientSecret: env.OAUTH_CLIENT_SECRET || 'test',
	authenticationServiceUrl:
		env.AUTHENTICATION_SERVICE_URL || 'http://localhost:8080',
	callbackUrl: env.CALLBACK_URL || 'http://localhost:3030',
})

export const REQUEST_TIMEOUT = Number(env.REQUEST_TIMEOUT) || 15000
