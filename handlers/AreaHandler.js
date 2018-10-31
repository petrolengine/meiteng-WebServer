"use strict";

const db = require('./DatabaseHandler').instance;
const createError = require('http-errors');

class AreaHandler {

    /**
     * @returns {AreaHandler} AreaHandler
     */
    static get instance() {
        if (!AreaHandler.__instance) {
            AreaHandler.__instance = new AreaHandler();
        }
        return AreaHandler.__instance;
    }

    /**
     * Get area list
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_area_list() {
        const result = await db.query("SELECT * FROM mt_get_area_list()");
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Add area
     * @param {*} info area info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_area(info) {
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const address = info.address || '';

        const result = await db.query("SELECT * FROM mt_add_area($1,$2)", [name, address]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = AreaHandler;