const express = require("express");
const {generateStudentReceipt, generateStaffReceipt} = require('./receipt.controller');

receiptRouter = express.Router();

receiptRouter.post('/generate/student', generateStudentReceipt);
receiptRouter.post('/generate/staff', generateStaffReceipt);

module.exports = receiptRouter;