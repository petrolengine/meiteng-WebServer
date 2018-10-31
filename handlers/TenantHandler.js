"use strict";

const db = require('./DatabaseHandler').instance;
const createError = require('http-errors');

class TenantHandler {

    /**
     * @returns {TenantHandler} TenantHandler
     */
    static get instance() {
        if (!TenantHandler.__instance) {
            TenantHandler.__instance = new TenantHandler();
        }
        return TenantHandler.__instance;
    }

    /**
     * Get tenant list
     * UserData.flag > get UserData.flag or
     * (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {*} userData user data
     * @param {number} offset database offset
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_tenant_list(userData, offset) {
        if (offset === undefined) {
            offset = 0;
        }
        const result = await db.query("SELECT * FROM mt_get_tenant_list($1,$2,$3,$4)", [50, offset, userData.id, userData.flag]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get tenant info
     * UserData.flag > get UserData.flag or
     * (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {*} userData user data
     * @param {number} id tenant id
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_tenant_info(userData, id) {
        if (id === undefined) {
            return [false, createError(400)];
        }
        const result = await db.query("SELECT * FROM mt_get_tenant_info($1,$2,$3)", [id, userData.id, userData.flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Set tenant info
     * @param {*} userData user data
     * @param {*} info tenant info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async set_tenant_info(userData, info) {
        const id = info.id; if (id === undefined) { return [false, createError(400)]; }
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const phone = info.phone || '';
        const id_card = info.id_card || '';

        const result = await db.query("SELECT * FROM mt_set_tenant_info($1,$2,$3,$4,$5,$6,$7)",
            [id, name, sex, phone, id_card, userData.id, userData.flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Add tenant
     * @param {*} userData user data
     * @param {*} info tenant info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_tenant(userData, info) {
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const phone = info.phone || '';
        const id_card = info.id_card || '';

        const result = await db.query("SELECT * FROM mt_add_tenant($1,$2,$3,$4,$5)", [name, sex, phone, id_card, userData.id]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = TenantHandler;