require("../database/databaseConn");

const mongoose = require("mongoose");

const monthlySalary = new mongoose.Schema({
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

module.exports = mongoose.model('monthly_salarys', monthlySalary);