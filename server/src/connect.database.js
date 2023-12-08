const mongoose = require('mongoose');
const logger = require('./utils/logger.utils');
const dotenv = require('dotenv');

async function connect() {
    const db_uri = process.env.DB_URI;
    // logger.info(db_uri);

    try {
        await mongoose.connect(db_uri);
        logger.info("> Database Connected");
    } catch (error) {
        logger.error("> Error connecting to database");
        process.exit(1);
    }
}

module.exports = connect;