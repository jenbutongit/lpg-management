import * as express from 'express'
import * as ctx from './ApplicationContext'

const expressNunjucks = require('express-nunjucks');

const app = express()

var appRoot = require('app-root-path');

app.set('views', appRoot + '/views');

expressNunjucks(app, {});

app.get('/', ctx.default.homeController.index());

app.listen(3000, () => console.log('Example app listening on port 3000! on ', appRoot))