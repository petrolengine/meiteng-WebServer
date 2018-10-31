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
     * @param {number} offset database offset
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_landlord_list(userData, offset) {
        if (offset === undefined) {
            offset = 0;
        }
        const result = await db.query("SELECT * FROM mt_get_landlord_list($1,$2,$3,$4)", [50, offset, userData.id, userData.flag]);
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
        const result = await db.query("SELECT * FROM mt_get_landlord_info($1,$2, $3)", [id, userData.id, userData.flag]);
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
        const id = info.id; if (id === undefined) { return [false, createError(400)]; }
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const phone = info.phone || '';
        const id_card = info.id_card || '';

        const result = await db.query("SELECT * FROM mt_set_landlord_info($1,$2,$3,$4,$5,$6,$7)",
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
     * Add landlord
     * @param {*} userData user data
     * @param {*} info landlord info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_landlord(userData, info) {
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const phone = info.phone || '';
        const id_card = info.id_card || '';

        const result = await db.query("SELECT * FROM mt_add_landlord($1,$2,$3,$4,$5)", [name, sex, phone, id_card, userData.id]);
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