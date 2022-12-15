require("../database/databaseConn");
const mongoose = require("mongoose");

const academic = new mongoose.Schema({
  school_name: {
    type: String,
  },
  class_id: {
    type: mongoose.Schema.ObjectId,
    ref: "classes",
    required: true,
  },
  student_id: {
    type: mongoose.Schema.ObjectId,
    ref: "students",
    required: true,
  },
  fees_id: {
    type: mongoose.Schema.ObjectId,
    ref: "fees",
    required: true,
  },
  is_transferred:{
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("academics", academic);
