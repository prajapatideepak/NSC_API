require('../database/databaseConn');
const mongoose = require('mongoose');

const basicInfoSchema = new mongoose.Schema({
    photo: {
        type: String,
    },
    name:{
        type: String,
        required: [true, "Please enter name"],
    },
    gender:{
        type: String,
        requried: [true, "Please select gender"],
    },
    dob:{
        type: Date,
        required: [true, "Please select date of birth"]
    }

});

module.exports = mongoose.model("BasicInfo", basicInfoSchema);