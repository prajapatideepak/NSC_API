const express = require("express");
const {generateStudentReceipt, generateStaffReceipt, updateStudentReceipt, updateStaffReceipt, searchReceipt} = require('./receipt.controller');

receiptRouter = express.Router();

receiptRouter.post('/generate/student', generateStudentReceipt);
receiptRouter.post('/generate/staff', generateStaffReceipt);
receiptRouter.put('/update/student/:fees_receipt_id', updateStudentReceipt);
receiptRouter.put('/update/staff/:salary_receipt_id', updateStaffReceipt);
receiptRouter.get('/search/:value', searchReceipt);

module.exports = receiptRouter;
