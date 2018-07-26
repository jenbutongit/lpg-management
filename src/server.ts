import * as express from 'express'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import * as cookieParser from 'cookie-parser'
import * as log4js from 'log4js'
import * as config from './config'
import * as serveStatic from 'serve-static'
import {Properties} from 'ts-json-properties'
import {ApplicationContext} from './applicationContext'
import * as i18n from 'i18n'

const logger = log4js.getLogger('server')
const expressNunjucks = require('express-nunjucks')

const appRoot = require('app-root-path')

const {PORT = 3005} = process.env
const app = express()
const FileStore = sessionFileStore(session)

log4js.configure(config.LOGGING)

i18n.configure({
	directory: 'src/locale',
})

app.use(i18n.init)

Properties.initialize()
const ctx = new ApplicationContext()

app.set('views', [
	appRoot + '/views',
	appRoot + '/node_modules/govuk-frontend/',
	appRoot + '/node_modules/govuk-frontend/components',
])

expressNunjucks(app, {})

app.use(
	session({
		cookie: {
			httpOnly: true,
			maxAge: 31536000,
			secure: false,
		},
		name: 'lpg-management',
		resave: true,
		saveUninitialized: true,
		secret:
			'dcOVe-ZW3ul77l23GiQSNbTJtMRio87G2yUOUAk_otcbL3uywfyLMZ9NBmDMuuOt',
		store: new FileStore({
			path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
		}),
	})
)
app.use(serveStatic(appRoot + '/dist/views/assets'))

app.use(
	'/govuk-frontend',
	express.static(appRoot + '/node_modules/govuk-frontend/')
)

app.use(
	'/assets',
	express.static(appRoot + '/node_modules/govuk-frontend/assets')
)

app.use(cookieParser())

ctx.auth.configure(app)

app.get('/', ctx.homeController.index())
app.get('/course', ctx.homeController.course())
app.listen(PORT, () => logger.info(`LPG Management listening on port ${PORT}`))
