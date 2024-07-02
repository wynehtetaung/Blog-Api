require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
   const { authorization } = req.headers;
   const token = authorization && authorization.split(" ")[1];
   if (!token) {
      return res.status(400).json({ message: "token required" });
   }
   const user = jwt.decode(token, process.env.JWT_SECRET_KEY);
   if (!user) {
      return res.status(401).json({ message: "incorrect token" });
   }

   res.locals.user = user;
   next();
}
module.exports = { auth };
