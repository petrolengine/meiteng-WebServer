"use strict";

const { Pool } = require('pg');

class DatabaseHandler {
    constructor() {
        this.__pool = new Pool();
        this.__pool.on("error", this.__onDbError.bind(this));
        this.__pool.on("connect", this.__onDbConnect.bind(this));
        this.__pool.on("acquire", this.__onDbAcquire.bind(this));
        this.__pool.on("remove", this.__onDbRemove.bind(this));
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

    init() {
        this.__pool.connect().catch((error) => {
            console.error(error.stack);
            process.exit(-1);
        });
    }

    /**
     * @param {string} queryText sql
     * @param {?any[]} values can be null
     * @returns {Promise<[boolean, QueryResult]>} Promise<[boolean, QueryResult]>
     */
    async query(queryText, values) {
        try {
            const value = await this.__pool.query(queryText, values);
            return [true, value];
        } catch (e) {
            console.log(e);
            return [false];
        }
    }

    __onDbError(err, client) {
        client.release();
        console.error(err.message);
        console.error(err.stack);
    }

    __onDbConnect(client) {
        // console.log("on connect");
    }

    __onDbAcquire(client) {
        // console.log("on acquire");
    }

    __onDbRemove(client) {
        // console.log("on remove");
    }
}

module.exports = DatabaseHandler;