const express = require("express");
const { getAllStudents, registerStudent } = require("./student.controller");

const studentRouter = express.Router();




studentRouter.get("/", getAllStudents);

studentRouter.get("/registerStudent", registerStudent);

module.exports = studentRouter;
