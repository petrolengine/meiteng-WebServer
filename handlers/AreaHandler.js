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
    async get_area_list(info) {
        const page = info.page || 0;
        const prePage = info.prePage || 5;
        const key = info.key || "";
        const offset = page * prePage;
        let result;

        if (key.length === 0) {
            result = await db.query("mt_get_area_list", [prePage, offset]);
        } else {
            result = await db.query("mt_get_area_list_by_key", ['%' + key + '%', prePage, offset]);
        }
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get area list
     * @param {*} info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_area_list2(info) {
        const key = info.key || "";
        const result = await this.get_area_list(info);
        if (!result[0]) {
            return result;
        }
        const ret = { data: result[1], total: 0 };
        ret.total = await db.getTotal("area", 0, 0, key);
        return [true, ret];
    }

    /**
     * Add area
     * @param {*} info area info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_area(info) {
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const address = info.address || '';
        const tags = info.tags || [];
        const traficTags = info.traficTags || [];

        const result = await db.query("mt_add_area", [name, address, tags, traficTags]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Set area info
     * @param {*} info area info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async set_area_info(info) {
        if (info.id === undefined) { return [false, createError(400)]; }
        const id = parseInt(info.id, 10);
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const address = info.address || '';

        const result = await db.query("mt_set_area_info", [id, name, address]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id !== id) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = AreaHandler;