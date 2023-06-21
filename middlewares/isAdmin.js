module.exports = function (req, res, next) {
  if (!req.session.user) {
    return next();
  }
  let roles = req.session.user.role;
  // console.log(roles);
  let admin = roles.find((r) => r == "admin");
  if (admin) req.session.user.isAdmin = true;
  next();
};
