const mongoose = require('mongoose');
const connection = mongoose.connection;

const config = require('../utils/config');
const logger = require('../utils/logger');


class Database {

    static instance;
    _db;

    constructor() {
        console.log(`Connexion to: mongodb://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}@${config.MONGODB_URI}/${config.MONGODB_DATABASE_NAME}`);

        mongoose.connect(`mongodb://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}@${config.MONGODB_URI}/${config.MONGODB_DATABASE_NAME}?authSource=admin`, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useFindAndModify: false, 
            useCreateIndex: true 
        });

        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
    }

    connected() {
        logger.info('Mongoose has connected');
    }

    error(error) {
        logger.error('Mongoose has errored', error);
    }
}

module.exports = Database;