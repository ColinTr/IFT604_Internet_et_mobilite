const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Solde = new mongoose.Schema({
    _dashboard: ObjectId,
    _user: ObjectId,
    value: Number
});

module.exports = mongoose.model("Solde", Solde);