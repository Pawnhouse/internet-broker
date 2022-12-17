maxLength = new Object();
maxLength[5] = ['stockCode', 'code'];
maxLength[30] = ['firstName', 'surname', 'middleName', 'company', 'sharesName', 'phone'];
maxLength[150] = ['headline', 'email'];


module.exports = function (req, res, next) {
  if (req.method == 'OPTIONS') {
    next();
  }
  try {
    const obj = req.body; 
    for (let i in maxLength) { 
      for (let j in maxLength[i]) { 
        const attribute = maxLength[i][j];
        if (obj[attribute] == undefined) {
          continue;
        } 
        if( typeof obj[attribute] !== 'string') {
          res.status(404).send({message: 'Incorrect value of attribute ' + attribute});
          return;
        } 
        if(obj[attribute].length > i) {
          res.status(404).send({message: 'The length of attribute ' + attribute + ' exceeds ' + i});
          return;
        }
      }
    }
    next();
  } catch(e) {
    console.error(e)
  }

}