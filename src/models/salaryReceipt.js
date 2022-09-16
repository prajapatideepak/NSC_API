require("../database/databaseConn");

const mongoose = require("mongoose");

const salaryReceipt = new mongoose.Schema({
    salary_receipt_id:{
        type: Number,
        unique: true,
        required: true,
    },
    is_hourly:{
        type: Number,
        required: true,
    },
    staff_id:{
        type: mongoose.Schema.ObjectId,
        ref: "staffs",
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
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('salary_receipts', salaryReceipt);