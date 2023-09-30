const jwt = require("jsonwebtoken");
const { privateKey } = require("../Config/config");
const { failAuthenticationCode } = require("../Config/response");

// Hàm tạo token
const createToken = (data) => {
  let token = jwt.sign({ content: data }, privateKey, {
    expiresIn: "5d",
    algorithm: "HS256",
  });
  return token;
};

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let checkedToken = jwt.verify(token, privateKey);
    if (checkedToken) {
      req.user = checkedToken;
      next();
    }
  } catch (err) {
    failAuthenticationCode(res, err.message);
  }
};

module.exports = {
  createToken,
  verifyToken,
};
