const express = require("express");
const {generateStudentReceipt, generateStaffReceipt, updateStudentReceipt, updateStaffReceipt} = require('./receipt.controller');

receiptRouter = express.Router();

receiptRouter.post('/generate/student', generateStudentReceipt);
receiptRouter.post('/generate/staff', generateStaffReceipt);
receiptRouter.put('/update/student/:fees_receipt_id', updateStudentReceipt);
receiptRouter.put('/update/staff/:staff_id', updateStaffReceipt);

module.exports = receiptRouter;