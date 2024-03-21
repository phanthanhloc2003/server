var jwt = require("jsonwebtoken");
const authUserMiddleware = (req, res, next) => {
  const token = req.headers?.token?.split(" ")[1] || '';

  jwt.verify(token, "access_token", function (err, user) {
    if (err) {
      return res.status(403).json({
        message: `Invalid token: ${err.message}`,
      });
    }
    req.userInfo = user;
    next();
  });
};

module.exports = { authUserMiddleware };
