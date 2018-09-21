"use strict";

const DatabaseHandler = require('./DatabaseHandler');
const createError = require('http-errors');

class AccountHandler {
    constructor() {
    }

    static get instance() {
        if (!AccountHandler.__instance) {
            AccountHandler.__instance = new AccountHandler();
        }
        return AccountHandler.__instance;
    }

    async login(name, psw) {
        if (!name || !psw) {
            return [false, createError(400)];
        }
        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_auth($1,$2)", [name, psw]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        if (result[1].rowCount === 0) {
            return [false, createError(403, "No such user.")];
        }
        if (!result[1].rows[0].passed) {
            return [false, createError(403, "Password error.")];
        }
        return [true, { id: result[1].rows[0].userid }];
    }

    async regist(name, psw, psw_repeat) {
        if (!name || !psw || !psw_repeat || psw !== psw_repeat) {
            return [false, createError(400)];
        }
        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_regist($1,$2)", [name, psw]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].userid === 0) {
            return [false, createError(403, "User exists.")];
        }
        return [true, { id: result[1].rows[0].userid }];
    }
}

module.exports = AccountHandler;