"use strict";

const db = require('./DatabaseHandler');
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
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {{page: number, prePage: number, key: string}} info request
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_tenant_list(userData, info) {
        const page = info.page || 0;
        const prePage = info.prePage || 5;
        const key = info.key || "";
        const offset = page * prePage;

        let result;
        if (key.length === 0)
            result = await db.query("mt_get_tenant_list", [prePage, offset, userData.id, userData.flag]);
        else
            result = await db.query("mt_get_tenant_list_by_key", ['%' + key + '%', prePage, offset, userData.id, userData.flag]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get tenant list2
     * UserData.flag > get UserData.flag or
     * (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {{page: number, prePage: number, key: string}} info request
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_tenant_list2(userData, info) {
        const key = info.key || "";
        const result = await this.get_tenant_list(userData, info);
        if (!result[0]) {
            return result;
        }
        const ret = { data: result[1], total: 0 };
        ret.total = await db.getTotal("tenant", userData.id, userData.flag, key);
        return [true, ret];
    }

    /**
     * Get tenant info
     * UserData.flag > get UserData.flag or
     * (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {number} id tenant id
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_tenant_info(userData, id) {
        if (id === undefined) {
            return [false, createError(400)];
        }
        const result = await db.query("mt_get_tenant_info", [id, userData.id, userData.flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Set tenant info
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {*} info tenant info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async set_tenant_info(userData, info) {
        if (info.id === undefined) { return [false, createError(400)]; }
        const id = parseInt(info.id, 10);
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const phone = info.phone || '';
        const id_card = info.id_card || '';

        const result = await db.query("mt_set_tenant_info", [id, name, sex, phone, id_card, userData.id, userData.flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id !== id) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Add tenant
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {*} info tenant info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_tenant(userData, info) {
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const age = info.age || 0;
        const phone = info.phone; if (phone === undefined) { return [false, createError(400)]; }
        const native_place = info.native_place || '';
        const id_card = info.id_card || '';
        const remarks = info.remarks || '';

        const result = await db.query("mt_add_tenant", [name, sex, age, phone, native_place, id_card, userData.id, remarks]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = TenantHandler.instance;