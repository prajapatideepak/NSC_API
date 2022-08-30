const express = require("express");
const { httpGetAllStudents } = require("./student.controller");

const studentRouter = express.Router();

studentRouter.get("/", httpGetAllStudents);

module.exports = studentRouter;
