const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (req.method == 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw Error();
    }
    req.user = jwt.verify(token, 'key432');
    next();
  } catch {
    res.status(401).send('Unauthorized');
  }

}