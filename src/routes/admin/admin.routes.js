const express = require("express");
const {
  httpInsertAdmin,
  httpLoginRequest,
  httpUpdateAdmin,
  httpGetadmin,
  httpVerifySuperAdmin
} = require("./admin.controller");

const adminRouter = express.Router();


adminRouter.put("/", httpUpdateAdmin);
adminRouter.post("/", httpInsertAdmin);
adminRouter.get("/:id", httpGetadmin);
adminRouter.post("/login", httpLoginRequest);
adminRouter.post("/verify", httpVerifySuperAdmin);

module.exports = adminRouter;
