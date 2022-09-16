require("../database/databaseConn");

const mongoose = require("mongoose");

const hourlySalary = new mongoose.Schema({
    total_hours:{
        type: Number,
        required: [true,'Please enter total hours'],
    },
    rate_per_hour:{
        type: Number,
        required: [true,'Please enter rate per hour'],
    },
    total_amount:{
        type: Number,
        required: [true, 'Please enter total amount'],
    },
    salary_receipt_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'salary_receipts',
        required: true,
    }
})

module.exports = mongoose.model('hourly_salarys', hourlySalary);