require("../database/databaseConn");

const mongoose = require("mongoose");

const classes = new mongoose.Schema({
    batch_start_year:{
        type: String,
        requied: [true, 'Please enter batch start year'],
    },
    batch_end_year:{
        type: String,
        requied: [true, 'Please enter batch end year'],
    },
    class_name:{
        type: String,
        required: [true, 'Please enter class_name'],
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
    is_active:{
        type: Number,
        required: true,
        default: 1
    },
    stream:{
        type: String,
        required: [true, 'Please select stream'],
    },
    medium:{
        type: String,
        required: [true, 'Please enter medium'],
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('classes', classes);