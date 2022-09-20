const express = require("express");
const {salaryFaculty,allSalary,getsalary } = require("../Salary/salary.controller");

const SalaryRouter = express.Router();



SalaryRouter.post("/create-reciept", salaryFaculty);

SalaryRouter.get("/",allSalary)

SalaryRouter.get("/receipt/:salary_receipt_id",getsalary)

module.exports = SalaryRouter;
