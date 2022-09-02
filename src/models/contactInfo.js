require('../database/databaseConn');
const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    whatsapp_no: {
        type: String,
        required: [true, "Please enter whatsapp number"]
    },
    alternative_no:{
        type: String,
    },
    gender:{
        type: String,
        requried: [true, "Please enter email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    address:{
        type: String,
        require: [true, "Please enter address"]
    }

});

module.exports = mongoose.model("ContactInfo", contactInfoSchema);