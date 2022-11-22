require("../database/databaseConn");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: {
    type: Number,
    unique: [true, "Please enter unique student id"],
    required: true,
  },
  mother_name: {
    type: String,
    required: [true, "Please enter mother name"],
  },
  basic_info_id: {
    type: mongoose.Schema.ObjectId,
    ref: "basic_infos",
    required: true,
  },
  contact_info_id: {
    type: mongoose.Schema.ObjectId,
    ref: "contact_infos",
    required: true,
  },
  admission_date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
  reference: {
    type: String,
  },
  is_cancelled: {
    type: Number,
    default: 0,
  },
});

studentSchema.virtual("academic", {
  ref: "academics",
  localField: "_id",
  foreignField: "student_id",
  justOne: false,
});

module.exports = mongoose.model("students", studentSchema);
