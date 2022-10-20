const express = require("express");
const {
  httpRegisterMail,
  httpFeesConfirmMail,
  httpPendingFees,
} = require("./mail.controller");

const mailRouter = express.Router();

mailRouter.post("/studentRegister", httpRegisterMail);
mailRouter.post("/feesRecipet", httpFeesConfirmMail);
mailRouter.post("/pendingStudent", httpPendingFees);

module.exports = mailRouter;
