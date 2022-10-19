const express = require("express");
const {
  httpInsertAdmin,
  httpLoginRequest,
  httpUpdateAdmin,
  httpGetadmin,
  httpVerifySuperAdmin
  httpGetAllAdmin,
  httpChangePassword,
  httpChangeByAdmin,
  httpSetDefault,
} = require("./admin.controller");

const adminRouter = express.Router();

adminRouter.put("/", httpUpdateAdmin);
adminRouter.post("/", httpInsertAdmin);
adminRouter.post("/verify", httpVerifySuperAdmin);


adminRouter.get("/", httpGetadmin);
adminRouter.get("/all", httpGetAllAdmin);
adminRouter.post("/login", httpLoginRequest);
adminRouter.put("/forgot", httpChangePassword);
adminRouter.put("/change", httpChangeByAdmin);
adminRouter.post("/default", httpSetDefault);
// adminRouter.put("/",())
module.exports = adminRouter;
