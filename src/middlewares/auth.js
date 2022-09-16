const { config } = require("dotenv");
const jwt = require("jsonwebtoken");

function GenrateToken(admin) {
  return jwt.sign({ id: admin.id }, "learneverything", {
    expiresIn: "100d",
  });
}

function VerifyToken(token) {
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
}

module.exports = {
  GenrateToken,
  VerifyToken,
};
