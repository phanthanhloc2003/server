var jwt = require("jsonwebtoken");
const authUserMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;

  jwt.verify(token, "access_token", function (err, user) {
    if (err) {
      return res.status(401).json({
        message: `Invalid token: ${err.message}`,
      });
    }
   
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  });
};

module.exports = { authUserMiddleware };
