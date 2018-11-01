"use strict";

const db = require('./DatabaseHandler').instance;
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
     * Get room list
     * @param {*} userData user data
     * @param {number} offset database offset
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_room_list(userData, offset) {
        if (offset === undefined) {
            offset = 0;
        }
        const result = await db.query("mt_get_room_list", [50, offset, userData.id, userData.flag]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Add room
     * @param {*} userDate user data
     * @param {*} info room info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_room(userDate, info) {

    }
}

module.exports = RoomHandler;