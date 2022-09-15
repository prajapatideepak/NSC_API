const express = require("express");
const { getPendingStudentFees } = require("./fees.controller");

const feesRouter = express.Router();

feesRouter.get("/pending", getPendingStudentFees);

module.exports = feesRouter;
