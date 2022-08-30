const express = require("express");
const { httpGetFeesData } = require("./fees.controller");

const feesRouter = express.Router();

feesRouter.get("/", httpGetFeesData);

module.exports = feesRouter;
