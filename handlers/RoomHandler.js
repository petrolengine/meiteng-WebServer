"use strict";

const db = require('./DatabaseHandler');
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
     * Get room sale list
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {{page: number, prePage: number}} info request
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_room_sale_list(userData, info) {
        const page = info.page || 0;
        const prePage = info.prePage || 5;
        const offset = page * prePage;

        const result = await db.query("mt_get_room_sale_list", [prePage, offset, userData.id, userData.flag]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get room rent list
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {{page: number, prePage: number}} info request
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async get_room_rent_list(userData, info) {
        const page = info.page || 0;
        const prePage = info.prePage || 5;
        const offset = page * prePage;

        const result = await db.query("mt_get_room_rent_list", [prePage, offset, userData.id, userData.flag]);
        if (!result[0]) {
            return [false, createError(500)];
        }
        return [true, result[1].rows];
    }

    /**
     * Get area id
     * @param {string} area area name
     * @returns {Promise<number>}
     */
    async get_area_id(area) {
        if (area === undefined) {
            return undefined;
        }
        const result = await db.query("mt_get_area_id", [area]);
        if (!result[0] || result[1].rowCount === 0) {
            return undefined;
        }
        return result[1].rows[0].id;
    }

    /**
     * Get landlord id
     * @param {string} landlord landlord name
     * @returns {Promise<number>}
     */
    async get_landlord_id(landlord) {
        if (landlord === undefined) {
            return undefined;
        }
        const result = await db.query("mt_get_landlord_id", [landlord]);
        if (!result[0] || result[1].rowCount === 0) {
            return undefined;
        }
        return result[1].rows[0].id;
    }

    /**
     * Add sale room
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {*} info room info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_sale_room(userData, info) {
        const decorate = info.decorate; if (decorate === undefined) { return [false, createError(400)]; }
        const type = info.type; if (type === undefined) { return [false, createError(400)]; }
        const direction = info.direction; if (direction === undefined) { return [false, createError(400)]; }
        const bedroom = info.bedroom; if (bedroom === undefined) { return [false, createError(400)]; }
        const livingroom = info.livingroom; if (livingroom === undefined) { return [false, createError(400)]; }
        const toliet = info.toliet; if (toliet === undefined) { return [false, createError(400)]; }
        const floor = info.floor; if (floor === undefined) { return [false, createError(400)]; }
        const property_management_company = info.property_management_company;
        if (property_management_company === undefined) { return [false, createError(400)]; }
        const has_park = info.has_park; if (has_park === undefined) { return [false, createError(400)]; }
        const room_area = info.room_area; if (room_area === undefined) { return [false, createError(400)]; }
        const total_price = info.total_price; if (total_price === undefined) { return [false, createError(400)]; }
        const unit_price = info.unit_price; if (unit_price === undefined) { return [false, createError(400)]; }

        const area_id = await this.get_area_id(info.area); if (area_id === undefined) { return [false, createError(400)]; }
        const landlord_id = await this.get_landlord_id(info.landlord); if (landlord_id === undefined) { return [false, createError(400)]; }

        const result = await db.query("mt_add_room_sale", [
            area_id, landlord_id, userData.id,
            decorate, type, direction,
            bedroom, livingroom, toliet,
            floor, property_management_company, has_park,
            room_area,
            info.aircondition || false, info.balcony || false, info.bed || false, info.broadband || false,
            info.elevator || false, info.gas || false, info.heating || false, info.hot_water_heater || false,
            info.refrigerator || false, info.tv || false, info.wardrobe || false, info.washing_machine || false,
            info.park_price || 0,
            total_price, unit_price
        ]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }

    /**
     * Add rent room
     * @param {{id: number, flag: number, name: string}} userData user data
     * @param {*} info room info
     * @returns {Promise<[boolean, any]>} Promise<[boolean, any]>
     */
    async add_rent_room(userData, info) {
        const decorate = info.decorate; if (decorate === undefined) { return [false, createError(400)]; }
        const type = info.type; if (type === undefined) { return [false, createError(400)]; }
        const direction = info.direction; if (direction === undefined) { return [false, createError(400)]; }
        const bedroom = info.bedroom; if (bedroom === undefined) { return [false, createError(400)]; }
        const livingroom = info.livingroom; if (livingroom === undefined) { return [false, createError(400)]; }
        const toliet = info.toliet; if (toliet === undefined) { return [false, createError(400)]; }
        const floor = info.floor; if (floor === undefined) { return [false, createError(400)]; }
        const property_management_company = info.property_management_company;
        if (property_management_company === undefined) { return [false, createError(400)]; }
        const has_park = info.has_park; if (has_park === undefined) { return [false, createError(400)]; }
        const room_area = info.room_area; if (room_area === undefined) { return [false, createError(400)]; }
        const total_price = info.total_price; if (total_price === undefined) { return [false, createError(400)]; }
        const unit_price = info.unit_price; if (unit_price === undefined) { return [false, createError(400)]; }

        const area_id = await this.get_area_id(info.area); if (area_id === undefined) { return [false, createError(400)]; }
        const landlord_id = await this.get_landlord_id(info.landlord); if (landlord_id === undefined) { return [false, createError(400)]; }

        const result = await db.query("mt_add_room_rent", [
            area_id, landlord_id, userData.id,
            decorate, type, direction,
            bedroom, livingroom, toliet,
            floor, property_management_company, has_park,
            room_area,
            info.aircondition || false, info.balcony || false, info.bed || false, info.broadband || false,
            info.elevator || false, info.gas || false, info.heating || false, info.hot_water_heater || false,
            info.refrigerator || false, info.tv || false, info.wardrobe || false, info.washing_machine || false,
            info.park_price || 0,
            total_price, unit_price
        ]);
        if (!result[0] || result[1].rowCount === 0) {
            return [false, createError(500)];
        }
        if (result[1].rows[0].id === null) {
            return [false, createError(409)];
        }
        return [true, result[1].rows[0]];
    }
}

module.exports = RoomHandler.instance;