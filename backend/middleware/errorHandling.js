const ApiError = require('../errors/apiError');

module.exports = function (err, req, res, next){
  if (err instanceof ApiError){
    res.status(err.status).json({message: err.message});
  } else {
    res.status(err.status).json({message: 'Unexpected error: ' + err.message});
  }
  
}