require("../database/databaseConn");

const mongoose = require("mongoose");

const admin = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please enter username'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please enter password'],
        select: false,
    },
    staff_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Staff',
        required: true,
    },
    is_super_admin:{
        type: Boolean,
        required: true,
        default: 0,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Admin', admin);