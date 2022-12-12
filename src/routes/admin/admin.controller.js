const {
  insertadmin,
  getAdminByUsername,
  updateAdminById,
  getAdminByid,
  getAdminByUser,
  ChangePassowrdByUsername,
  getAllAdmin,
  changeAdminByUsername,
} = require("../../model/admin.model");
const bcrypt = require("bcrypt");
const {
  GenrateToken,
  createToken,
  verifyToken,
} = require("../../middlewares/auth");
const admin = require("../../models/admin");

async function httpInsertAdmin(req, res) {
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
      error: "Fill the required fields",
    });
  }

  try {
    const user = await getAdminByUsername(admin.username.trim())
    if(user){
      return res.status(500).json({
        ok: false,
        error: 'Admin already exist with this username',
      });
    }
    const hasedPassword = await bcrypt.hash(admin.password, 10);

    admin.password = hasedPassword;

    const basic = await insertadmin(admin);

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
    const username = await verifyToken(token);
    const admin = await getAdminByUser(username.userID);

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
      error: error.message,
    });
  }
}

async function httpChangeByAdmin(req, res) {
  const { username } = req.body;
  try {
    const adminData = await getAdminByUser(username);
    const result = await changeAdminByUsername(username, {
      is_super_admin: !adminData.is_super_admin,
    });
    return res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function httpSetDefault(req, res) {
  const { username } = req.body;
  const password = "admin";

  try {
    const hasedPassword = await bcrypt.hash(password, 10);
    const result = await changeAdminByUsername(username, {
      password: hasedPassword,
    });
    return res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
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
      return res.status(400).json({ error: "Invalid username or Password" });
    }
  } catch (error) {
    return res.json({ error: `${error}` });
  }
}

async function httpVerifySuperAdmin(req, res) {
  const superAdminData = req.body;
  if (!superAdminData.username || !superAdminData.password) {
    return res.status(400).json({ message: "Please Enter Value" });
  }

  try {
    const superAdminDetails = await getAdminByUsername(superAdminData.username);

    if (!superAdminDetails) {
      return res.status(400).json({
        error: "Invalid username or Password",
      });
    }

    if (superAdminDetails.is_super_admin == 0) {
      return res.status(400).json({
        error: "Only Super Admin Can Edit",
      });
    }

    if (
      await bcrypt.compare(superAdminData.password, superAdminDetails.password)
    ) {
      return res.status(200).json({ success: "verified" });
    } else {
      return res.status(400).json({ error: "Invalid username or Password" });
    }
  } catch (error) {
    return res.json({ ok: false, error: `${error}` });
  }
}

async function httpAdminpinverify(req, res) {
  const loginData = req.body;
  if (!loginData.security_pin) {
    return res.status(400).json({ ok: false, error: "Please Enter Value" });
  }

  try {
    const adminData = await getAdminByUsername(loginData.security_pin);

    if (!adminData) {
      return res.status(400).json({
        ok: false,
        error: "User Not found",
      });
    }

    if (bcrypt.compare(loginData.security_pin)) {
      const token = await createToken(loginData.security_pin);
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
  const token = req.headers.authorization;
  const data = req.body;
  if (!token) {
    return res.status(400).json({
      ok: false,
      false: "Enter Valid Data",
    });
  }
  try {
    const username = await verifyToken(token);

    const result = await updateAdminById(username.userID, data);
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

async function httpChangePassword(req, res) {
  const data = req.body;
  const token = req.headers.authorization;

  if (!data.oldpassword || !data.newpassword || !data.confirmpassword) {
    return res.status(400).send("All Fields are Required");
  }

  if (data.newpassword !== data.confirmpassword) {
    return res.status(400).send("Password Did not match");
  }

  try {
    const username = await verifyToken(token);
    const admin = await getAdminByUsername(username.userID);

    if (admin) {
      const hasedOldpassword = await bcrypt.hash(data.oldpassword, 10);
      if (await bcrypt.compare(data.oldpassword, admin.password)) {
        const hasedPassword = await bcrypt.hash(data.newpassword, 10);
        try {
          const result = ChangePassowrdByUsername(
            username.userID,
            hasedPassword
          );
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).send(error.message);
        }
      } else {
        return res.status(400).send("Wrong Old Password");
      }
    }
  } catch (error) {
    return res.status(500).send(error?.message);
  }
}

async function httpGetAllAdmin(req, res) {
  try {
    const adminData = await getAllAdmin();
    res.status(200).json(adminData);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

///admin authentication super admin

module.exports = {
  httpInsertAdmin,
  httpChangePassword,
  httpLoginRequest,
  httpChangeByAdmin,
  httpGetadmin,
  httpGetAllAdmin,
  httpUpdateAdmin,
  httpVerifySuperAdmin,
  httpSetDefault,
  httpVerifySuperAdmin,
  httpAdminpinverify,
};
