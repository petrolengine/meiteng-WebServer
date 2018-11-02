"use strict";

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const jwt = require('express-jwt');
const createError = require('http-errors');
const fs = require('fs');
const { createLogger, format, transports } = require('winston');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

// init env
{
    const dotenv = require('dotenv');
    dotenv.config();
    let filename = path.join(process.cwd(), '.env.production');
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        filename = path.join(process.cwd(), '.env.development');
    }
    if (fs.existsSync(filename)) {
        const envConfig = dotenv.parse(fs.readFileSync(filename));
        for (var k in envConfig) {
            process.env[k] = envConfig[k]
        }
    }
}

const myFormat = format.printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    format: format.combine(
        format.label({ label: 'right meow!' }),
        format.timestamp(),
        myFormat
    ),
    transports: [new transports.File({
        filename: path.join(process.env.LOG_ROOT_DIR || __dirname, 'server.log'),
        json: false
    }),
    new transports.Console()]
});

logger.info('logging from your IoC container-based logger');

// init db
require("./handlers/DatabaseHandler").instance.init();

app.use(morgan('common', {
    stream: fs.createWriteStream(
        path.join(process.env.LOG_ROOT_DIR || __dirname, 'access.log'), { flags: 'a' }
    )
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({
    secret: process.env.PUBLIC_KEY,
    credentialsRequired: false,
}).unless({ path: ['/login', '/regist'] }));

if (process.env.NODE_ENV === 'development') {
    app.use(require('cors')());
}

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => next(createError(404)));
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    const ret = {};
    ret.message = err.message;
    if (process.env.NODE_ENV === 'development') {
        ret.stack = err.stack;
    }

    if (err.name === 'UnauthorizedError') {
        res.status(401);
    } else {
        res.status(err.status || 500);
    }
    res.json(ret);
});

module.exports = app;