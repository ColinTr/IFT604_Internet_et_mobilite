require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
const MONGODB_DASHBOARD_ID = process.env.MONGODB_DASHBOARD_ID;

module.exports = {
    PORT,
    MONGODB_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_DATABASE_NAME,
    MONGODB_DASHBOARD_ID
};