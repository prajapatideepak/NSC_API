require("../database/databaseConn");

const mongoose = require("mongoose");

const feesReceipt = new mongoose.Schema({
    fees_receipt_id:{
        type: Number,
        required: true,
    },
    fees_id:{
        type: mongoose.Schema.ObjectId,
        ref: "fees",
        required: true,
    },
    admin_id:{
        type: mongoose.Schema.ObjectId,
        ref: "admins",
        required: true,
    },
    transaction_id:{
        type: mongoose.Schema.ObjectId,
        ref: "transactions",
        required: true,
    },
    discount:{
        type: Number,
        default: 0,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('fees_receipts', feesReceipt);