class Utils {
  constructor() {}

  function checkUserLoggedIn(req, res, next) {
    if (!req.cookies.token) {
      res.sendStatus(401);
    } else {
      let userObject = jwt.decode(req.cookies.token);
      let userId = userObject.sub.id;
      req.userId = userId;
      next();
    }
  }
}

module.exports = Utils;
