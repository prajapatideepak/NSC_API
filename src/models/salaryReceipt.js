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
        default: 0
    },
    staff_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Staff",
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

module.exports = mongoose.model('SalaryReceipt', salaryReceipt);