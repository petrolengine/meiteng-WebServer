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
     * Get staff list
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
     * Get staff info
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
     * Set staff info
     * @param {*} userData user data
     * @param {*} info new staff info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async SetStaffInfo(userData, info) {
        const id = info.id; if (id === undefined) { return [false, createError(400)]; }
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const phone = info.phone; if (phone === undefined) { return [false, createError(400)]; }
        const id_card = info.id_card; if (id_card === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const password = info.password; if (password === undefined) { return [false, createError(400)]; }

        if (userData.flag !== 2 && userData.id !== id) {
            return [false, createError(403)];
        }

        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_set_staff_info($1,$2,$3,$4,$5,$6)",
            [id, name, phone, id_card, sex, password]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].ret !== id) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Add staff
     * @param {*} userData user data
     * @param {*} info new staff info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async AddStaff(userData, info) {
        if (userData.flag !== 2) {
            return [false, createError(403)];
        }

        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const phone = info.phone; if (phone === undefined) { return [false, createError(400)]; }
        const id_card = info.id_card; if (id_card === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const password = info.password; if (password === undefined) { return [false, createError(400)]; }

        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_add_staff($1,$2,$3,$4,$5,1)",
            [name, phone, id_card, sex, password, flag]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Delete staff
     * @param {*} userData user data
     * @param {number} in staff id to delete
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async DeleteStaff(userData, id) {
        if (userData.flag !== 2 || userData.id === id) {
            return [false, createError(403)];
        }

        if (id === undefined) {
            return [false, createError(400)];
        }

        const result = await DatabaseHandler.instance.query("SELECT * FROM mt_del_staff($1)", [id]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = StaffHandler;