require("../database/databaseConn");

const mongoose = require("mongoose");

const classes = new mongoose.Schema({
    batch_year:{
        type: Date,
        requied: [true, 'Please enter batch year'],
    },
    standard:{
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
    medium_id:{
        type: mongoose.Schema.ObjectId,
        ref: "mediums",
        required: true, 
    },
})

module.exports = mongoose.model('Classes', classes);