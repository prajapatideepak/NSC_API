const express = require("express");
const {
  httpInsertAdmin,
  httpLoginRequest,
  httpUpdateAdmin,
  httpGetadmin,
} = require("./admin.controller");

const adminRouter = express.Router();

adminRouter.put("/", httpUpdateAdmin);
adminRouter.post("/", httpInsertAdmin);
adminRouter.get("/", httpGetadmin);

adminRouter.post("/login", httpLoginRequest);
// adminRouter.put("/",())
module.exports = adminRouter;
