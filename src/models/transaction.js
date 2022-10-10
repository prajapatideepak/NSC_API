require("../database/databaseConn");

const mongoose = require("mongoose");

const transaction = new mongoose.Schema({
    is_by_cheque:{
        type: Number,
        required: true,
        default: 0
    },
    is_by_cash:{
        type: Number,
        required: true,
        default: 1
    },
    is_by_upi:{
        type: Number,
        required: true,
        default: 0
    },
    cheque_no:{
        type: Number,
        default: -1
    },
    upi_no:{
        type: String,
        default: "-1",
    },
    amount:{
        type: Number,
        required: [true, 'Please enter amount']
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('transactions', transaction);