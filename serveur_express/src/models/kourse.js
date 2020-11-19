const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Kourse = new mongoose.Schema({
    _dashboard: ObjectId,
    elements: [ObjectId]
});

module.exports = mongoose.model("Kourse", Kourse)

