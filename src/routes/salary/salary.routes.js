const express = require("express");
const {salaryFaculty,allSalary,getsalary,updateStaffReceipt,getFaculty,getFacultyhistory, } = require("../Salary/salary.controller");

const SalaryRouter = express.Router();


SalaryRouter.get("/",allSalary)

SalaryRouter.post("/create-reciept", salaryFaculty);

// SalaryRouter.get("/facultysalary/:id", getFaculty);

SalaryRouter.get("/Staffhistory/:id", getFacultyhistory);

SalaryRouter.get("/receipt/:salary_receipt_id",getsalary);

SalaryRouter.put("/update/:salary_receipt_id",updateStaffReceipt);



module.exports = SalaryRouter;
