require("../database/databaseConn");

const mongoose = require("mongoose");

const feesReceipt = new mongoose.Schema({
    fees_receipt_id:{
        type: Number,
        unique: true,
        required: true,
    },
    admin_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Admin",
        required: true,
    },
    transaction_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Transaction",
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('FeesReceipt', feesReceipt);