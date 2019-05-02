"use strict";

const db = require('./DatabaseHandler').instance;
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
     * Get staff list, UserData.flag >= get UserData.flag
     * @param {*} userData user data
     * @param {number} page current page, start with 0
     * @param {number} prePage num of staffs pre page
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_staff_list(userData, info) {
        const page = info.page || 0;
        const prePage = info.prePage || 5;
        const key = info.key || "";
        const offset = page * prePage;

        let result;
        if (key.length === 0)
            result = await db.query("mt_get_staff_list", [prePage, offset]);
        else
            result = await db.query("mt_get_staff_list_by_key", ['%' + key + '%', prePage, offset]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get staff info, UserData.flag >= get UserData.flag
     * @param {*} userData user data
     * @param {number} id staff id
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_staff_info(userData, id) {
        if (id === undefined) {
            id = userData.id;
        }
        const result = await db.query("mt_get_staff_info($1,$2)", [id, userData.flag]);
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
     * Set staff info, UserData.flag > set UserData.flag
     * @param {*} userData user data
     * @param {*} info new staff info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async set_staff_info(userData, info) {
        if (info.id === undefined) { return [false, createError(400)]; }
        const id = parseInt(info.id, 10);
        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const phone = info.phone; if (phone === undefined) { return [false, createError(400)]; }
        const id_card = info.id_card; if (id_card === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }

        const result = await db.query("mt_set_staff_info", [id, name, phone, id_card, sex]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id !== id) {
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
    async add_staff(userData, info) {
        if (userData.flag < 2) {
            return [false, createError(403)];
        }

        const name = info.name; if (name === undefined) { return [false, createError(400)]; }
        const sex = info.sex; if (sex === undefined) { return [false, createError(400)]; }
        const age = info.age; if (age === undefined) { return [false, createError(400)]; }
        const phone = info.phone; if (phone === undefined) { return [false, createError(400)]; }
        const native_place = info.native_place; if (native_place === undefined) { return [false, createError(400)]; }
        const id_card = info.id_card; if (id_card === undefined) { return [false, createError(400)]; }
        const remarks = info.remarks || '';

        const result = await db.query("mt_add_staff", [name, sex, age, phone, native_place, id_card, remarks]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Delete staff, UserData.flag > delete UserData.flag
     * @param {*} userData user data
     * @param {number} id staff id to delete
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async delete_staff(userData, id) {
        if (id === undefined) {
            return [false, createError(400)];
        }

        if (userData.id === id) {
            return [false, createError(403)];
        }

        const result = await db.query("mt_del_staff", [id, userData.flag]);
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