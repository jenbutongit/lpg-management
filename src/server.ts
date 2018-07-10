import * as express from 'express'
import * as ctx from './ApplicationContext'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import {Auth} from "./identity/auth"
import * as passport from "passport"

const expressNunjucks = require('express-nunjucks');

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

var appRoot = require('app-root-path');

app.set('views', appRoot + '/views');

expressNunjucks(app, {});

const auth = new Auth('f90a4080-e5e9-4a80-ace4-f738b4c9c30e',
	'test',
	'http://localhost:8080',
	'http://localhost:3030',
	passport
	)

app.use(auth.initialize())
app.use(auth.session())

// passport.configure()

// app.use(passport.isAuthenticated)

app.get('/', ctx.default.homeController.index());

app.listen(3030, () => console.log('Example app listening on port 3030! on ', appRoot))