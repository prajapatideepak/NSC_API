require("../database/databaseConn");

const mongoose = require("mongoose");

const medium = new mongoose.Schema({
    medium_name:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Medium', medium);