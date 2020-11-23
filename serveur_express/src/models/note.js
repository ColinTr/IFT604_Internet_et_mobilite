const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Note = new mongoose.Schema({
    _dashboard: ObjectId,
    title: String,
    content: String,
    author: ObjectId,
    taggedUsers: [ObjectId],
    date: Date
});

module.exports = mongoose.model("Note", Note);

