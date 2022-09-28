const { config } = require("dotenv");
const jwt = require("jsonwebtoken");

const JWTSign = process.env.JWT_SIGN;

async function createToken(userID) {
  try {
    const token = jwt.sign({ userID }, JWTSign);
    return token;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { createToken };
