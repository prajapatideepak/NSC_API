require("../database/databaseConn");

const mongoose = require("mongoose");

const category = new mongoose.Schema({
    category_name:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('categorys', category);