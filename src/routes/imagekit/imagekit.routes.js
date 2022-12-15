const express = require("express");
const {imagekitAuth} = require("./imagekit.controller")
const imagekitAuthRouter = express.Router();

imagekitAuthRouter.get("/auth", imagekitAuth);

module.exports = imagekitAuthRouter