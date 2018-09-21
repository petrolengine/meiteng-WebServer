"use strict";

const DatabaseHandler = require('./DatabaseHandler');

class RoomHandler {
    static get instance() {
        if (!RoomHandler.__instance) {
            RoomHandler.__instance = new RoomHandler();
        }
        return RoomHandler.__instance;
    }

    async get_room_info(userData, offset) {
        if (offset === undefined) {
            offset = 0;
        }
        // todo add admin account
        const result = await DatabaseHandler.instance.query("SELECT * FROM room_info LIMIT 50 OFFSET $1", [offset]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }
}

module.exports = RoomHandler;