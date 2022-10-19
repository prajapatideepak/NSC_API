const express = require("express");
const { getAllPendingStudentsFees, studentFeesHistory, studentAllAcademicDetails, transferFeesToStudent } = require("./fees.controller");

const feesRouter = express.Router();

feesRouter.get("/pending/:is_primary", getAllPendingStudentsFees);

//feesRouter.get("/student/:student_id", getStudentFeesDetails);

feesRouter.get("/all-academics/:student_id", studentAllAcademicDetails);

feesRouter.get("/fees-history/:academic_id", studentFeesHistory);
feesRouter.post("/transfer", transferFeesToStudent);

module.exports = feesRouter;
