require("../database/databaseConn");

const mongoose = require("mongoose");

const staff = new mongoose.Schema({
    basic_info_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'BasicInfo',
        required: true,
    },
    contact_info_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'ContactInfo',
        required: true,
    },
    joining_date:{
        type: Date,
        required: [true, 'Please enter joining date'],
    }
})

module.exports = mongoose.model('Staff', staff);