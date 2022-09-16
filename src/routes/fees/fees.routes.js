const express = require("express");
const { getAllPendingStudentsFees, studentFessHistory } = require("./fees.controller");

const feesRouter = express.Router();

feesRouter.get("/pending", getAllPendingStudentsFees);

// feesRouter.get("/student/:student_id", getStudentFeesDetails);

feesRouter.get("/student-history", studentFessHistory);

module.exports = feesRouter;
