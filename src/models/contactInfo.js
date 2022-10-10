require("../database/databaseConn");
const validator = require("validator");

const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
    whatsapp_no: {
        type: String,
        required: [true, "Please enter whatsapp number"],
        maxLength: [10, "Whatsapp number should be of 10 digits"],
        minLength: [10, "Whatsapp number should be of 10 digits"]
    },
    alternative_no:{
        type: String,
        maxLength: [10, "Alternate number should be of 10 digits"],
        minLength: [10, "Alternate number should be of 10 digits"]
    },
    email:{
        type: String,
    },
    address:{
        type: String,
        required: [true, "Please enter address"]
    }

});

module.exports = mongoose.model("contact_infos", contactInfoSchema);
