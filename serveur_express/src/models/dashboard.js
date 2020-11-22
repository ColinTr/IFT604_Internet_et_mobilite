const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Dashboard = new mongoose.Schema({
    _dashboard: ObjectId,
    name: String,
    users: [ObjectId]
});

module.exports = mongoose.model("Dashboard", Dashboard);