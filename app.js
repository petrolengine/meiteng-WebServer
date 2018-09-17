var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('express-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('dotenv').config(process.cwd() + '.env');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({
    secret: process.env.PUBLIC_KEY,
    credentialsRequired: false,
}).unless({ path: ['/login', '/regist'] }));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => next(createError(404)));
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    ret = {};
    ret.message = err.message;
    ret.stack = err.stack;

    if (err.name === 'UnauthorizedError') {
        res.status(401);
    } else {
        res.status(err.status || 500);
    }
    res.json(ret);
});

module.exports = app;
