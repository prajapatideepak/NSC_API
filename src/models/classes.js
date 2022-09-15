require("../database/databaseConn");

const mongoose = require("mongoose");

const classes = new mongoose.Schema({
    batch_year:{
        type: String,
        requied: [true, 'Please enter batch year'],
    },
    class_name:{
        type: String,
        required: [true, 'Please select standard'],
    },
    total_student:{
        type: Number,
        required: [true, 'Please enter total Students'],
    },
    fees:{
        type: Number,
        required: [true, 'Please enter fees'],
    },
    is_primary:{
        type: Number,
        required: true,
    },
    stream:{
        type: String,
        required: [true, 'Please select stream'],
    },
    medium:{
        type: String,
        required: [true, 'Please enter medium'],
    }
})

module.exports = mongoose.model('classes', classes);