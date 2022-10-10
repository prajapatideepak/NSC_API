const express = require("express");
const { getAllPendingStudentsFees, studentFeesHistory, studentAllAcademicDetails } = require("./fees.controller");

const feesRouter = express.Router();

feesRouter.get("/pending", getAllPendingStudentsFees);

//feesRouter.get("/student/:student_id", getStudentFeesDetails);

feesRouter.get("/all-academics/:student_id", studentAllAcademicDetails);

feesRouter.get("/fees-history/:academic_id", studentFeesHistory);

module.exports = feesRouter;
