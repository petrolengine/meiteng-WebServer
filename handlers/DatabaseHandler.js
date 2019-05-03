"use strict";

const { Pool } = require('pg');
const logger = require("./LoggerHandler");

class DatabaseHandler {
    constructor() {
        this.__pool = new Pool();
        this.__pool.on("error", this.__onDbError.bind(this));
        this.initialized = false;
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
            const res = await this.__pool.query("SELECT * FROM mt_get_init_data(0,0)");
            res.rows.forEach((o) => {
                this.global_data[o.key] = o.count;
            });
            this.initialized = true;
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
        if (!this.initialized) {
            return [false];
        }
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
}

module.exports = DatabaseHandler;