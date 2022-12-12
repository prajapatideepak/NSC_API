require("../database/databaseConn");
const bcrypt = require("bcrypt");

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
        ref: 'staffs',
        required: true,
    },
    is_super_admin:{
        type: Number,
        required: true,
        default: 0,
    },
    security_pin:{
        type: String,
        required: [true, 'Please enter security pin'],
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

admin.methods.checkPassoword = async function (password) {
};

module.exports = mongoose.model("admins", admin);
