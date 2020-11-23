const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Message = new mongoose.Schema({
    _dashboard: ObjectId,
    content: String,
    author: String,
    taggedUsers: [ObjectId],
    date: Date
});

module.exports = mongoose.model("Message", Message);
