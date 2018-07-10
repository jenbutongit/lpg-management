import * as express from 'express'
import * as ctx from './ApplicationContext'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'

const expressNunjucks = require('express-nunjucks')

const app = express()

const FileStore = sessionFileStore(session)

app.use(
	session({
		cookie: {
			httpOnly: true,
			maxAge: 31536000,
			secure: false,
		},
		name: 'lpg-management-ui',
		resave: true,
		saveUninitialized: true,
		secret: 'dcOVe-ZW3ul77l23GiQSNbTJtMRio87G2yUOUAk_otcbL3uywfyLMZ9NBmDMuuOt',
		store: new FileStore({
			path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
		}),
	})
)

var appRoot = require('app-root-path')

app.set('views', appRoot + '/views')

expressNunjucks(app, {})

app.use(ctx.default.auth.initialize())
app.use(ctx.default.auth.session())

ctx.default.auth.configureStrategy()

// app.use(passport.isAuthenticated)

app.get('/', ctx.default.homeController.index())

app.listen(3030, () =>
	console.log('Example app listening on port 3030! on ', appRoot)
)
