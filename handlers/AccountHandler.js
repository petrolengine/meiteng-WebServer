"use strict";

const db = require('./DatabaseHandler');
const createError = require('http-errors');

class AccountHandler {

    /**
     * @returns {AccountHandler} AccountHandler
     */
    static get instance() {
        if (!AccountHandler.__instance) {
            AccountHandler.__instance = new AccountHandler();
        }
        return AccountHandler.__instance;
    }

    /**
     * @param {string} name account name
     * @param {string} psw password
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async login(name, psw) {
        if (!name || !psw) {
            return [false, createError(400)];
        }
        const result = await db.query("mt_login", [name, psw]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        if (result[1].rowCount === 0) {
            return [false, createError(403, "No such user.")];
        }
        if (!result[1].rows[0].passed) {
            return [false, createError(403, "Password error.")];
        }
        const ret = { id: result[1].rows[0].id, flag: result[1].rows[0].flag };
        ret['totals'] = await db.getTotals(ret.id, ret.flag);
        return [true, ret];
    }
}

module.exports = AccountHandler.instance;