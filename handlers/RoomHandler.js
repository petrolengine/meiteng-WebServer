"use strict";

const DatabaseHandler = require('./DatabaseHandler');
const createError = require('http-errors');

class RoomHandler {

    /**
     * @returns {RoomHandler} RoomHandler
     */
    static get instance() {
        if (!RoomHandler.__instance) {
            RoomHandler.__instance = new RoomHandler();
        }
        return RoomHandler.__instance;
    }

    /**
     * @param {*} userData user data
     * @param {number} offset database offset
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_room_info(userData, offset) {
        if (offset === undefined) {
            offset = 0;
        }
        // todo add admin account
        const result = await DatabaseHandler.instance.query("SELECT * FROM room LIMIT 50");
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }
}

module.exports = RoomHandler;