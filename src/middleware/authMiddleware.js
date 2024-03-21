var jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
 
  const token = req.headers.token.split(" ")[1];

  jwt.verify(token, "access_token", function (err, user) {
    if (err) {
        return res.status(403).json({
          message: `Invalid token: ${err.message}`,
        });
      }
    
    if (user?.isAdmin) {
      next()
    }
    else{
        return res.status(403).json({
            message: "Invalid token",
        });
    }
  });
  
};

module.exports = { authMiddleware };
