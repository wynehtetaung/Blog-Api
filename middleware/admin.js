const admin = (req, res, next) => {
   const { user } = res.locals.user;
   if (user.role.toLocaleLowerCase() !== "admin") {
      return res.status(401).json({
         success: false,
         message: "not allowed",
      });
   }
   next();
};
module.exports = { admin };
