require('../database/databaseConn');
const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
    whatsapp_no: {
        type: String,
        required: [true, "Please enter whatsapp number"],
        maxLength: [10, "Whatsapp number should be of 10 digits"]
    },
    alternative_no:{
        type: String,
        maxLength: [10, "Alternate number should be of 10 digits"]
    },
    gender:{
        type: String,
        requried: [true, "Please enter email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    address:{
        type: String,
        required: [true, "Please enter address"]
    }

});

module.exports = mongoose.model("ContactInfo", contactInfoSchema);