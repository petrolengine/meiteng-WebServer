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
     * UserData.flag > get UserData.flag or (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
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
     * UserData.flag > get UserData.flag or (UserData.flag = get UserData.flag and UserData.id = get UserData.id)
     * @param {*} userData user data
     * @param {number} id database offset
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_landlord_info(userData, id) {
        if (id === undefined) {
            return [false, createError(400)];
        }
    }
}

module.exports = LandlordHandler;