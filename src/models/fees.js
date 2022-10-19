require("../database/databaseConn");
const mongoose = require('mongoose');

const fees = new mongoose.Schema({
    discount:{
        type: Number,
        default: 0
    },
    net_fees:{
        type: Number,
        required:[true, 'Please enter net fees']
    },
    pending_amount:{
        type: Number,
        required: [true, 'Pending amount is required']
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

fees.virtual("fees_receipt_virtual", {
  ref: "fees_receipts",
  localField: "_id",
  foreignField: "fees_id",
  justOne: false,
});

module.exports = mongoose.model('fees', fees);