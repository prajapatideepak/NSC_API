require('../database/databaseConn');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id:{
        type: Number,
        unique: true,
        required: true,
    },
    mother_name:{
        type: String,
        required: [true, "Please enter mother name"],
    },
    basic_info_id: {
        type: mongoose.Schema.ObjectId,
        ref: "BasicInfo",
        required: true,
    },
    contact_info_id:{
        type: mongoose.Schema.ObjectId,
        ref: "ContactInfo",
        required: true,
    },
    reg_date:{
        type: Date,
        require: true
    }

});

module.exports = mongoose.model("Student", studentSchema);