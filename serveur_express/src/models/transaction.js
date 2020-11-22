const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Transaction = new mongoose.Schema({
    from: ObjectId,     // User from
    to: ObjectId,       // User to
    type: String,
    montant: Number,
    object: String,
    date: Date
});

module.exports = mongoose.model("Transaction", Transaction);