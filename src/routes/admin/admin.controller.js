const {
  insertAdmin,
  getAdminByUsername,
  updateAdminById,
  getAdminByid,
  getAdminByUser,
} = require("../../model/admin.model");
const bcrypt = require("bcrypt");
const {
  GenrateToken,
  createToken,
  verifyToken,
} = require("../../middlewares/auth");
const admin = require("../../models/admin");

async function httpInsertAdmin(req, res) {
  console.log(req.body);
  const admin = req.body;

  if (
    !admin.full_name ||
    !admin.username ||
    !admin.password ||
    !admin.email ||
    !admin.whatsapp_no ||
    !admin.security_pin
  ) {
    return res.status(400).json({
      ok: false,
      error: "Missing Student Property",
    });
  }

  try {
    const hasedPassword = await bcrypt.hash(admin.password, 10);

    admin.password = hasedPassword;

    const basic = await insertAdmin(admin);

    return res.status(201).json({ ok: true, data: basic });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

async function httpGetadmin(req, res) {
  const token = req.headers.authorization;

  try {
    const username = verifyToken(token);
    const admin = await getAdminByUser(username);

    if (admin) {
      res.status(200).json({
        ok: true,
        data: admin,
      });
    } else {
      res.status(400).json({
        ok: false,
        error: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error,
    });
  }
}

async function httpLoginRequest(req, res) {
  const loginData = req.body;
  if (!loginData.username || !loginData.password) {
    return res.status(400).json({ ok: false, error: "Please Enter Value" });
  }

  try {
    const adminData = await getAdminByUsername(loginData.username);

    if (!adminData) {
      return res.status(400).json({
        ok: false,
        error: "User Not found",
      });
    }

    if (await bcrypt.compare(loginData.password, adminData.password)) {
      const token = await createToken(loginData.username);
      return res
        .status(200)
        .json({ ok: true, success: "Login succesfully", token: token });
    } else {
      return res.status(400).json({ ok: false, error: "Incorrect Password" });
    }
  } catch (error) {
    return res.json({ ok: false, error: `${error}` });
  }
}

async function httpUpdateAdmin(req, res) {
  const { _id, ...data } = req.body;

  console.log(data);
  if (!_id) {
    return res.status(400).json({
      ok: false,
      false: "Enter Valid Data",
    });
  }
  try {
    const result = await updateAdminById(_id, data);
    res.status(200).json({
      ok: true,
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
