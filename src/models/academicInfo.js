require("../database/databaseConn");
const mongoose = require('mongoose');

const academic = new mongoose.Schema({
    school_name:{
        type: String,
        required: [true, "Please enter school name"],
    },
    class_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Class",
        required: true
    },
    student_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Student",
        required: true,
    },
    fees_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Fee",
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Academic', academic);