const express = require("express");
const { getAllFaculty ,registerFaculty,editFaculty,deleteFaculty,getFacultydetails,Exportallfaculty } = require("../Faculty/faculty.controller");

const facultyRouter = express.Router();

facultyRouter.get("/", getAllFaculty);

facultyRouter.get("/Exportallfaculty", Exportallfaculty);

facultyRouter.post("/register", registerFaculty);

facultyRouter.get("/Facultydetails/:id", getFacultydetails);

facultyRouter.put("/update/:id", editFaculty);

facultyRouter.post("/delete/:id", deleteFaculty);




module.exports = facultyRouter;
