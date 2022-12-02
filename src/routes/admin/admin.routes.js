const express = require("express");
const admin = require("../../models/admin");
const { handleFunction } = require("../../whatsapp/test");
const {
  httpInsertAdmin,
  httpLoginRequest,
  httpUpdateAdmin,
  httpGetadmin,
  httpGetAllAdmin,
  httpChangePassword,
  httpChangeByAdmin,
  httpSetDefault,
  httpVerifySuperAdmin,
  httpAdminpinverify
} = require("./admin.controller");

const adminRouter = express.Router();

adminRouter.put("/", httpUpdateAdmin);
adminRouter.post("/", httpInsertAdmin);
adminRouter.post("/pinverify", httpAdminpinverify);
adminRouter.get("/", httpGetadmin);
adminRouter.post("/login", httpLoginRequest);
adminRouter.post("/verify", httpVerifySuperAdmin);
adminRouter.get("/all", httpGetAllAdmin);
adminRouter.put("/forgot", httpChangePassword);
adminRouter.put("/change", httpChangeByAdmin);
adminRouter.post("/default", httpSetDefault);
adminRouter.post("Authenticate",)

module.exports = adminRouter;
