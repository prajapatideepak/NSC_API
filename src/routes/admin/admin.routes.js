const express = require("express");
const { handleFunction } = require("../../whatsapp/test");
const {
  httpInsertAdmin,
  httpLoginRequest,
  httpUpdateAdmin,
  httpGetadmin,
  httpVerifySuperAdmin,
  httpGetAllAdmin,
  httpChangePassword,
  httpChangeByAdmin,
  httpSetDefault,
} = require("./admin.controller");

const adminRouter = express.Router();

adminRouter.put("/", httpUpdateAdmin);
adminRouter.post("/", httpInsertAdmin);
adminRouter.get("/:id", httpGetadmin);
adminRouter.post("/login", httpLoginRequest);
adminRouter.post("/verify", httpVerifySuperAdmin);
adminRouter.get("/all", httpGetAllAdmin);
adminRouter.put("/forgot", httpChangePassword);
adminRouter.put("/change", httpChangeByAdmin);
adminRouter.post("/default", httpSetDefault);

module.exports = adminRouter;
