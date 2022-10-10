const express = require("express");
const { httpGetReport } = require("./report.controller");

const reportRouter = express.Router();

reportRouter.get("/", httpGetReport);

module.exports = reportRouter;
