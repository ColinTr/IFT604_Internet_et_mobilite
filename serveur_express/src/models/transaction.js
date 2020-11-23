const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Transaction = new mongoose.Schema({
    _dashboard: ObjectId,
    from: ObjectId,     // User from
    to: [ObjectId],       // Users to
    montant: Number,
    object: String,
    date: Date
});

module.exports = mongoose.model("Transaction", Transaction);