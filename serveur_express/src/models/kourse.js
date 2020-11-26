const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

var Elements = mongoose.Schema({
    content: String,
    quantity: Number,
    bought: Boolean,
});

const Kourse = new mongoose.Schema({
    _dashboard: ObjectId,
    title: String,
    elements: [Elements],
});

module.exports = mongoose.model("Kourse", Kourse);
