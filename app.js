const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const history = require("connect-history-api-fallback");

require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production';

const indexRouter = require('./routes/index');
const sessionRouter = require('./routes/session');

const userRouter = require('./routes/users');
const businessRouter = require('./routes/businesses');
const reviewRouter = require('./routes/reviews');
const badgeRouter = require('./routes/badges');

const searchRouter = require('./routes/search');


const app = express();

app.use(session({
    secret: 'Zelp',
    resave: true,
    saveUninitialized: true
  }));

// allows us to make requests from POSTMAN
if (!isProduction) app.use(require('cors')());
// log requests to backend
if (!isProduction) app.use(require('morgan')('dev'));

// adding this so vue router can correctly go to /notfound
app.use(history());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'private')));

app.use('/', indexRouter);

app.use('/api/user', userRouter);
app.use('/api/business', businessRouter);
app.use('/api/review', reviewRouter);
app.use('/api/session', sessionRouter);
app.use('/api/badge', badgeRouter);
app.use('/api/search', searchRouter);

// no page handler
app.use('*', (req, res) => res.redirect('/'));

module.exports = app;