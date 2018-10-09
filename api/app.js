/*  MODULES */
const config = require('config');
const express = require('express');
const logger = require('./middlewares/logger');
const helmet = require('helmet');

const users = require('./routes/users');
const exams = require('./routes/exams');
const home = require('./routes/home');

/* DEBUG CONSTS */
const configDebug = require('debug')('app:config');
const portDebug = require('debug')('app:port');

/* CONFIGURATION */
configDebug('App Name: ', config.get('name'));
configDebug('Mail Host: ', config.get('mail.host'));
// configDebug('Mail Password: ', config.get('mail.password'));

/* DEFINE APP */
const app = express();

/* VIEW */
app.set('view engine', 'pug');
app.set('views', './views');

/* MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

/* DEV MIDDLEWARES */
if (app.get('env') === 'development') {
    app.use(logger);
}

/*  ROUTES MIDDLEWARES*/
app.use('/', home);
app.use('/api/users', users);
app.use('/api/exams', exams);

/*  LISTEN  */
app.listen(3000);