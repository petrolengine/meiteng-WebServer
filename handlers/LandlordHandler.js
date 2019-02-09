"use strict";

const db = require('./DatabaseHandler').instance;
const createError = require('http-errors');

class LandlordHandler {

    /**
     * @returns {LandlordHandler} LandlordHandler
     */
    static get instance() {
        if (!LandlordHandler.__instance) {
            LandlordHandler.__instance = new LandlordHandler();
        }
        return LandlordHandler.__instance;
    }

    /**
     * Get landlord list
     * UserData.flag > get UserData.flag or
     * (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {*} userData user data
     * @param {number} page current page, start with 0
     * @param {number} prePage num of staffs pre page
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_landlord_list(userData, page, prePage) {
        const offset = page * prePage;
        const result = await db.query("mt_get_landlord_list", [prePage, offset, userData.id, userData.flag]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get landlord info
     * UserData.flag > get UserData.flag or
     * (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {*} userData user data
     * @param {number} id landlord id
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_landlord_info(userData, id) {
        if (id === undefined) {
            return [false, createError(400)];
        }
        const result = await db.query("mt_get_landlord_info", [id, userData.id, userData.flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Set landlord info
     * @param {*} userData user data
     * @param {*} info landlord info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async set_landlord_info(userData, info) {
        if (info.id === undefined) { return [false, createError(400)]; }
        const id = parseInt(info.id, 10);
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const phone = info.phone || '';
        const id_card = info.id_card || '';

        const result = await db.query("mt_set_landlord_info", [id, name, sex, phone, id_card, userData.id, userData.flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id !== id) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Add landlord
     * @param {*} userData user data
     * @param {*} info landlord info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_landlord(userData, info) {
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const age = info.age || 0;
        const phone = info.phone; if (phone === undefined) { return [false, createError(400)]; }
        const native_place = info.native_place || '';
        const id_card = info.id_card || '';
        const remarks = info.remarks || '';

        const result = await db.query("mt_add_landlord", [name, sex, age, phone, native_place, id_card, userData.id, remarks]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = LandlordHandler;