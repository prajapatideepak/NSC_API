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
    alternate_no:{
        type: String,
    },
    email:{
        type: String,
        require: [true, "Please enter email"]
    },
    address:{
        type: String,
        required: [true, "Please enter address"]
    }

});

module.exports = mongoose.model("contact_infos", contactInfoSchema);
