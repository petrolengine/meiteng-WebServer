"use strict";

const path = require('path');
const { createLogger, format, transports } = require('winston');

class LoggerHandler {
    constructor() {
        this.logger = createLogger({
            format: format.combine(
                format.label({ label: 'MeiTeng' }),
                format.timestamp(),
                format.printf(info => {
                    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
                })
            ),
            transports: [new transports.File({
                filename: path.join(process.env.LOG_ROOT_DIR || (__dirname + "/../"), 'server.log'),
                json: false
            })]
        });
    }

    /**
     * @returns {LoggerHandler} LoggerHandler
     */
    static get instance() {
        if (!LoggerHandler.__instance) {
            LoggerHandler.__instance = new LoggerHandler();
        }
        return LoggerHandler.__instance;
    }
}

module.exports = LoggerHandler.instance.logger;