require("../database/databaseConn");

const mongoose = require("mongoose");

const staff = new mongoose.Schema({
    basic_info_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'basic_infos',
        required: true,
    },
    contact_info_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'contact_infos',
        required: true,
    },  
    joining_date:{
        type: Date,
        required: [true, 'Please enter joining date'],
    }
})

module.exports = mongoose.model('staffs', staff);