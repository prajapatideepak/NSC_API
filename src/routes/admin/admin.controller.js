const {
  insertAdmin,
  getAdminByUsername,
  updateAdminById,
  getAdminByid,
} = require("../../model/admin.model");
const bcrypt = require("bcrypt");
const { GenrateToken } = require("../../middlewares/auth");
const admin = require("../../models/admin");

async function httpInsertAdmin(req, res) {
  const admin = req.body;

  if (
    !admin.full_name ||
    !admin.username ||
    !admin.password ||
    !admin.email ||
    !admin.whatsapp_no
  ) {
    return res.status(400).json({
      messsage: "Missing Student Property",
    });
  }

  try {
    const hasedPassword = await bcrypt.hash(admin.password, 10);

    admin.password = hasedPassword;

    const basic = await insertAdmin(admin);

    return res.status(201).json(basic);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

async function httpGetadmin(req, res) {
  const id = req.params.id;

  console.log(req.params.id);
  try {
    const admin = await getAdminByid(id);

    res.status(200).json(admin);
  } catch (error) {}
}

async function httpLoginRequest(req, res) {
  const loginData = req.body;
  if (!loginData.username || !loginData.password) {
    return res.status(400).json({ message: "Please Enter Value" });
  }

  try {
    const adminData = await getAdminByUsername(loginData.username);

    if (!adminData) {
      return res.status(400).json({
        error: "User Not found",
      });
    }

  
    if (await bcrypt.compare(loginData.password, adminData.password)) {
      return res.status(200).json({ success: "Login succesfully" });
    } else {
      return res.status(400).json({ Error: "Incorrect Password" });
    }
  } catch (error) {
    return res.json({ error: `${error}` });
  }
}

async function httpUpdateAdmin(req, res) {
  const { _id, ...data } = req.body;

  console.log(data);
  if (!_id) {
    return res.status(400).json({
      message: "Enter Valid Data",
    });
  }
  try {
    const result = await updateAdminById(_id, data);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      error: `error ${e}`,
    });
  }
}

module.exports = {
  httpInsertAdmin,
  httpLoginRequest,
  httpGetadmin,
  httpUpdateAdmin,
};
