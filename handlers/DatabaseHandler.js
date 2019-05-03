"use strict";

const { Pool } = require('pg');
const logger = require("./LoggerHandler");

class DatabaseHandler {
    constructor() {
        this.__pool = new Pool();
        this.__pool.on("error", this.__onDbError.bind(this));
        this.global_data = {};
    }

    /**
     * @returns {DatabaseHandler} DatabaseHandler
     */
    static get instance() {
        if (!DatabaseHandler.__instance) {
            DatabaseHandler.__instance = new DatabaseHandler();
        }
        return DatabaseHandler.__instance;
    }

    /**
     * Get init data from database
     */
    async init() {
        try {
            logger.info(JSON.stringify(this.global_data));
        } catch (e) {
            console.error(e);
            process.exit(-1);
        }
    }

    /**
     * Query with database, return false when init is not finished.
     * @param {string} queryText sql
     * @param {?any[]} values can be null
     * @returns {Promise<[boolean, QueryResult]>} Promise<[boolean, QueryResult]>
     */
    async query(queryText, values) {
        let sql = `SELECT * FROM ${queryText}(`;
        if (values !== undefined) {
            for (let idx = 1; idx <= values.length; idx++) {
                sql += (idx === 1) ? `$${idx}` : `,$${idx}`;
            }
        }
        sql += ")";

        try {
            const res = await this.__pool.query(sql, values);
            return [true, res];
        } catch (e) {
            console.error(e);
            return [false];
        }
    }

    __onDbError(err, client) {
        console.log("on db error");
        console.error(err);
    }

    /**
     * Get totals for staff id
     * @param {*} id Staff id
     * @param {*} flags Staff flags
     * @returns {Promise<*>} Promise<*>
     */
    async getTotals(id, flags) {
        if (this.global_data[id] === undefined) {
            const res = await this.__pool.query("SELECT * FROM mt_get_init_data($1, $2)", [id, flags]);
            const temp = {};
            res.rows.forEach((o) => {
                temp[o.key] = o.count;
            });
            this.global_data[id] = temp;
        }
        return this.global_data[id];
    }

    /**
     * Get total by type and search key
     * @param {string} type Data type
     * @param {number} id Staff id
     * @param {number} flags Staff flag
     * @param {string} key Search key
     * @returns {Promise<number>} Promise<number>
     */
    async getTotal(type, id, flags, key) {
        if (key.length === 0) {
            const totals = await this.getTotals(id, flags);
            return totals[type];
        }
        let result;
        switch (type) {
            case "area":
                result = await this.query(`mt_get_area_count_by_key`, ['%' + key + '%']);
                break;
            default:
                result = await this.query(`mt_get_${type}_count_by_key`, ['%' + key + '%', id, flags]);
                break;
        }
        if (!result[0] || result[1].rowCount !== 1) {
            return 0;
        }
        return result[1].rows[0].count;
    }
}

module.exports = DatabaseHandler;