import * as express from 'express'
import * as ctx from './ApplicationContext'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import * as cookieParser from 'cookie-parser'
import {Auth} from './identity/auth'

const expressNunjucks = require('express-nunjucks')
const appRoot = require('app-root-path')

const app = express()
const FileStore = sessionFileStore(session)

expressNunjucks(app, {})

app.set('views', appRoot + '/views')

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
		secret: 'dcOVe-ZW3ul77l23GiQSNbTJtMRio87G2yUOUAk_otcbL3uywfyLMZ9NBmDMuuOt',
		store: new FileStore({
			path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
		}),
	})
)
app.use(cookieParser())

app.use(ctx.default.auth.initialize())
app.use(ctx.default.auth.session())

ctx.default.auth.configureStrategy()

app.all(
	Auth.AUTHENTICATION_PATH,
	ctx.default.auth.authenticate(),
	ctx.default.auth.redirect()
)

app.use(ctx.default.auth.checkAuthenticated())

app.get('/', ctx.default.homeController.index())

app.listen(3030, () =>
	console.log('Example app listening on port 3030! on ', appRoot)
)
