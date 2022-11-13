const express = require("express");
const { getAllFaculty ,registerFaculty,editFaculty,deleteFaculty,getFacultydetails } = require("../Faculty/faculty.controller");

const facultyRouter = express.Router();

facultyRouter.get("/", getAllFaculty);

facultyRouter.post("/register", registerFaculty);

facultyRouter.get("/Facultydetails/:id", getFacultydetails);

facultyRouter.put("/update/:id", editFaculty);

facultyRouter.post("/delete/:id", deleteFaculty);




module.exports = facultyRouter;
