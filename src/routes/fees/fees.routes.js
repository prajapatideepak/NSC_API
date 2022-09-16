const express = require("express");
const { httpGetFeesData } = require("./fees.controller");

const feesRouter = express.Router();

feesRouter.get("/:search", httpGetFeesData);

module.exports = feesRouter;
