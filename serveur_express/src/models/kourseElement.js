const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const KourseElement = new mongoose.Schema({
    name: String,
    img: String     // Url 
});

module.exports = mongoose.model("KourseElement", KourseElement)

