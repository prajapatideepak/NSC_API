const express = require("express");
const { getAllFaculty ,registerFaculty,getFaculty,editFaculty,deleteFaculty } = require("../Faculty/faculty.controller");

const facultyRouter = express.Router();

facultyRouter.get("/", getAllFaculty);

facultyRouter.post("/register", registerFaculty);

facultyRouter.get("/details/:id", getFaculty);

facultyRouter.post("/update/:id", editFaculty);

facultyRouter.post("/delete/:id", deleteFaculty);



module.exports = facultyRouter;
