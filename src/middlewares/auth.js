const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const { getAdminByUser } = require("../model/admin.model");

const JWTSign = process.env.JWT_SIGN;

async function createToken(userID) {
  try {
    const token = jwt.sign({ userID }, JWTSign);
    return token;
  } catch (error) {
    console.error(error);
  }
}

async function verifyToken(token) {
  const decodeUsername = await jwt.verify(token, JWTSign);
  return decodeUsername;
}

async function checkToken(req, res, next) {
  // const token = req?.headers?.authorization;
  // if (!token) {
  //   return res.status(400).json({
  //     ok: false,
  //     error: "authentic User",
  //   });
  // }

  // try {
  //   const username = await verifyToken(token);

  //   const admin = await getAdminByUser(username.userID);

  //   if (admin) {
  //     next();
  //   } else {
  //     res.status(400).json({
  //       ok:  ,
  //       error: "invalid username",
  //     });
  //   }
  // } catch (error) {
  //   return res.status(500).json({ ok: false, error: error });
  // }
  next();
}

module.exports = { createToken, checkToken, verifyToken };
