import * as express from 'express'
import * as ctx from './ApplicationContext'
import * as passport from './identity/passport'

const expressNunjucks = require('express-nunjucks');

const app = express()

var appRoot = require('app-root-path');

app.set('views', appRoot + '/views');

expressNunjucks(app, {});

passport.configure(
	'f90a4080-e5e9-4a80-ace4-f738b4c9c30e',
	'test',
	'http://localhost:8080',
	app,
	'http://localhost:3000'
)

app.get('/', ctx.default.homeController.index());

app.listen(3000, () => console.log('Example app listening on port 3000! on ', appRoot))