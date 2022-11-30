const jwt = require('jsonwebtoken');

module.exports = function(roles) {
  return function (req, res, next) {
    if (req.method == 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw Error();
      }
      req.user = jwt.verify(token, 'key432');
      if (!roles.includes(req.user.role) && (req.query.personId || req.body.personId) != req.user.id.toString()) {
        res.status(403).send('No access');
        return;
      }
      next();
    } catch {
      res.status(401).send('Unauthorized');
    }
  }
}
