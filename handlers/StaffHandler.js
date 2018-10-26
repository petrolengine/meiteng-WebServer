"use strict";

const DatabaseHandler = require('./DatabaseHandler');
const createError = require('http-errors');

class StaffHandler {

    /**
     * @returns {StaffHandler} StaffHandler
     */
    static get instance() {
        if (!StaffHandler.__instance) {
            StaffHandler.__instance = new StaffHandler();
        }
        return StaffHandler.__instance;
    }

    /**
     * @param {*} userData user data
     * @param {number} offset database offset
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async GetStaffList(userData, offset) {
        if (userData.flag !== 2) {
            return [false, createError(403)];
        }
        if (offset === undefined) {
            offset = 0;
        }
        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_get_staff_list($1,$2)", [50, offset]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * @param {*} userData user data
     * @param {number} id staff id
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async GetStaffInfo(userData, id) {
        if (userData.flag !== 2 && userData.id !== id) {
            return [false, createError(403)];
        }
        if (id === undefined) {
            id = userData.id;
        }
        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_get_staff_info($1)", [id]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        if (result[1].rowCount === 0) {
            return [false, createError(404, "No such user.")];
        }
        result[1].rows[0].id = id;
        return [true, result[1].rows[0]];
    }

    /**
     * @param {*} userData user data
     * @param {*} info new staff info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async AddStaff(userData, info) {
        if (userData.flag !== 2) {
            return [false, createError(403)];
        }
        // TODO test info struct
    }
}

module.exports = StaffHandler;