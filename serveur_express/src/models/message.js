const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Message = new mongoose.Schema({
    _dashboard: ObjectId,
    author: String,
    taggedUsers: [ObjectId],
    message: String,
    date: Date
});

module.exports = mongoose.model("Message", Message)

