require("../database/databaseConn");
const mongoose = require('mongoose');

const fees = new mongoose.Schema({
    total_fees:{
        type: String,
        required: [true, 'Please enter total fees']
    },
    discount:{
        type: Number,
        default: 0
    },
    net_fees:{
        type: String,
        required:[true, 'Please enter net fees']
    },
    pending_amount:{
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Fee', fees);